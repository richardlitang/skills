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

export function expandHome(p) {
  return p.startsWith('~/') ? path.join(os.homedir(), p.slice(2)) : p;
}
