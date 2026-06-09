#!/usr/bin/env node
// scripts/sync-skills.mjs
// Sync curated skills from this repo to installed runtime skill dirs.
// Usage: node scripts/sync-skills.mjs --check [--target <name>]
//        node scripts/sync-skills.mjs --apply [--target <name>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ROOT = path.join(REPO_ROOT, 'codex');
const MANIFEST_PATH = path.join(REPO_ROOT, 'skills.manifest.json');

// Pairs apply sequentially; a later pair can match output of an earlier one — caller orders more-specific pairs first.
export function applyTermMap(content, termPairs = []) {
  let out = content;
  for (const [from, to] of termPairs) out = out.split(from).join(to);
  return out;
}

export function isIgnored(relPath, ignore = []) {
  const segments = relPath.split('/');
  for (const pattern of ignore) {
    if (pattern.startsWith('*.')) {
      if (relPath.endsWith(pattern.slice(1))) return true;
    } else if (segments.includes(pattern)) {
      return true;
    }
  }
  return false;
}

export function listFiles(dir, ignore = [], prefix = '') {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (isIgnored(rel, ignore)) continue;
    if (entry.isDirectory()) out.push(...listFiles(path.join(dir, entry.name), ignore, rel));
    else out.push(rel);
  }
  return out.sort();
}

// Only `~/`-prefixed paths are expanded; bare `~` (no slash) is returned unchanged.
export function expandHome(p) {
  return p.startsWith('~/') ? path.join(os.homedir(), p.slice(2)) : p;
}

export function planTarget({ name, sourceRoot, targetRoot, skills, exclude = [], termPairs = [], unmanaged = [], ignore = [] }) {
  const skillList = (skills === 'all'
    ? fs.readdirSync(sourceRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory()).map((e) => e.name)
    : skills
  ).filter((s) => !exclude.includes(s)).sort();

  const missing = [];
  const modified = [];
  const ok = [];
  for (const skill of skillList) {
    const sourceDir = path.join(sourceRoot, skill);
    for (const rel of listFiles(sourceDir, ignore)) {
      const skillRel = `${skill}/${rel}`;
      // Invariant: sync handles text files only; binary types must be in the manifest ignore list (utf8 round-trip corrupts them).
      const expected = applyTermMap(fs.readFileSync(path.join(sourceDir, rel), 'utf8'), termPairs);
      const targetFile = path.join(targetRoot, skill, rel);
      if (!fs.existsSync(targetFile)) missing.push(skillRel);
      else if (fs.readFileSync(targetFile, 'utf8') !== expected) modified.push(skillRel);
      else ok.push(skillRel);
    }
  }

  const known = new Set([...skillList, ...unmanaged]);
  const unknownDirs = !fs.existsSync(targetRoot) ? [] :
    fs.readdirSync(targetRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !known.has(e.name))
      .map((e) => e.name).sort();

  return { target: name, skills: skillList, missing, modified, ok, unknownDirs };
}

export function applyPlan(plan, { sourceRoot, targetRoot, termPairs = [] }) {
  for (const skillRel of [...plan.missing, ...plan.modified]) {
    const content = applyTermMap(fs.readFileSync(path.join(sourceRoot, skillRel), 'utf8'), termPairs);
    const dest = path.join(targetRoot, skillRel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }
}

// Returns { apply, check, targetFilter } or { error, exitCode } on invalid args.
export function parseCliArgs(args, knownTargets) {
  const apply = args.includes('--apply');
  const check = args.includes('--check') || !apply;
  const targetIdx = args.indexOf('--target');
  let targetFilter = null;
  if (targetIdx !== -1) {
    const val = args[targetIdx + 1];
    if (!val || val.startsWith('--')) {
      return { error: 'error: --target requires a value', exitCode: 2 };
    }
    if (!knownTargets.includes(val)) {
      return { error: `error: unknown target "${val}" (known: ${knownTargets.join(', ')})`, exitCode: 2 };
    }
    targetFilter = val;
  }
  return { apply, check, targetFilter };
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const knownTargets = Object.keys(manifest.targets);
  const parsed = parseCliArgs(process.argv.slice(2), knownTargets);
  if (parsed.error) {
    process.stderr.write(parsed.error + '\n');
    process.exit(parsed.exitCode);
  }
  const { apply, check, targetFilter } = parsed;
  let drift = false;

  for (const [name, t] of Object.entries(manifest.targets)) {
    if (targetFilter && name !== targetFilter) continue;
    const opts = {
      name, sourceRoot: SOURCE_ROOT, targetRoot: expandHome(t.dir),
      skills: t.skills, exclude: t.exclude ?? [], termPairs: t.termPairs ?? [],
      unmanaged: t.unmanaged ?? [], ignore: manifest.ignore ?? []
    };
    const plan = planTarget(opts);
    const issues = plan.missing.length + plan.modified.length + plan.unknownDirs.length;
    console.log(`[${name}] ${plan.ok.length} ok, ${plan.missing.length} missing, ${plan.modified.length} modified, unknown dirs: ${plan.unknownDirs.join(', ') || 'none'}`);
    for (const f of plan.missing) console.log(`  missing:  ${f}`);
    for (const f of plan.modified) console.log(`  modified: ${f}`);
    if (apply && plan.unknownDirs.length) {
      console.log(`  [warn] unknown dirs skipped (review manually): ${plan.unknownDirs.join(', ')}`);
    }
    if (apply && (plan.missing.length || plan.modified.length)) {
      applyPlan(plan, opts);
      console.log(`  applied ${plan.missing.length + plan.modified.length} file(s)`);
    } else if (issues) {
      drift = true;
    }
  }
  if (check && !apply && drift) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
