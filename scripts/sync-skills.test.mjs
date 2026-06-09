// scripts/sync-skills.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyTermMap, isIgnored, listFiles, expandHome, parseCliArgs } from './sync-skills.mjs';

// Track temp dirs for cleanup on exit.
const tempDirs = [];
process.on('exit', () => {
  for (const d of tempDirs) fs.rmSync(d, { recursive: true, force: true });
});

test('applyTermMap applies pairs in order; caller puts more-specific pairs first', () => {
  const pairs = [['Claude Code', 'Codex'], ['Claude', 'Codex']];
  assert.equal(applyTermMap('Claude Code and Claude instances', pairs), 'Codex and Codex instances');
});

test('applyTermMap with no pairs returns content unchanged', () => {
  assert.equal(applyTermMap('hello', []), 'hello');
});

test('isIgnored matches directory segments and *.ext patterns', () => {
  const ignore = ['dist', '.system', '*.mp4'];
  assert.equal(isIgnored('ux-writing-skill/dist/bundle.js', ignore), true);
  assert.equal(isIgnored('ux-writing-skill/demo.mp4', ignore), true);
  assert.equal(isIgnored('ux-writing-skill/SKILL.md', ignore), false);
});

test('listFiles returns sorted relative paths, filtered by ignore', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-'));
  tempDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'references'));
  fs.mkdirSync(path.join(dir, 'dist'));
  fs.writeFileSync(path.join(dir, 'SKILL.md'), 'x');
  fs.writeFileSync(path.join(dir, 'references', 'a.md'), 'x');
  fs.writeFileSync(path.join(dir, 'dist', 'junk.js'), 'x');
  assert.deepEqual(listFiles(dir, ['dist']), ['SKILL.md', 'references/a.md']);
});

test('expandHome expands ~/x and leaves /abs/x unchanged', () => {
  assert.equal(expandHome('~/x'), path.join(os.homedir(), 'x'));
  assert.equal(expandHome('/abs/x'), '/abs/x');
});

import { planTarget, applyPlan } from './sync-skills.mjs';

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'syncfix-'));
  tempDirs.push(root);
  const source = path.join(root, 'source');
  const target = path.join(root, 'target');
  fs.mkdirSync(path.join(source, 'skill-a'), { recursive: true });
  fs.writeFileSync(path.join(source, 'skill-a', 'SKILL.md'), 'Use Claude Code here. Claude helps.');
  fs.mkdirSync(path.join(source, 'skill-b'), { recursive: true });
  fs.writeFileSync(path.join(source, 'skill-b', 'SKILL.md'), 'skill b');
  fs.mkdirSync(target, { recursive: true });
  return { source, target };
}

test('planTarget reports missing skills, modified files, and unknown dirs', () => {
  const { source, target } = makeFixture();
  fs.mkdirSync(path.join(target, 'skill-a'), { recursive: true });
  fs.writeFileSync(path.join(target, 'skill-a', 'SKILL.md'), 'stale content');
  fs.mkdirSync(path.join(target, 'mystery-skill'), { recursive: true });
  const plan = planTarget({
    name: 't', sourceRoot: source, targetRoot: target,
    skills: ['skill-a', 'skill-b'], termPairs: [], unmanaged: [], ignore: []
  });
  assert.deepEqual(plan.modified, ['skill-a/SKILL.md']);
  assert.deepEqual(plan.missing, ['skill-b/SKILL.md']);
  assert.deepEqual(plan.unknownDirs, ['mystery-skill']);
});

test('planTarget applies termPairs before comparing and respects unmanaged', () => {
  const { source, target } = makeFixture();
  fs.mkdirSync(path.join(target, 'skill-a'), { recursive: true });
  fs.writeFileSync(path.join(target, 'skill-a', 'SKILL.md'), 'Use Codex here. Codex helps.');
  fs.mkdirSync(path.join(target, '.system'), { recursive: true });
  const plan = planTarget({
    name: 't', sourceRoot: source, targetRoot: target,
    skills: ['skill-a'], termPairs: [['Claude Code', 'Codex'], ['Claude', 'Codex']],
    unmanaged: ['.system'], ignore: []
  });
  assert.deepEqual(plan.modified, []);
  assert.deepEqual(plan.missing, []);
  assert.deepEqual(plan.unknownDirs, []);
});

test('parseCliArgs validates --target: missing value, unknown target, and valid target', () => {
  const known = ['codex', 'claude', 'agents'];

  // Missing value (next arg starts with --)
  assert.deepEqual(
    parseCliArgs(['--check', '--target', '--apply'], known),
    { error: 'error: --target requires a value', exitCode: 2 }
  );

  // No value at all (--target is last arg)
  assert.deepEqual(
    parseCliArgs(['--check', '--target'], known),
    { error: 'error: --target requires a value', exitCode: 2 }
  );

  // Unknown target name
  assert.deepEqual(
    parseCliArgs(['--check', '--target', 'nope'], known),
    { error: 'error: unknown target "nope" (known: codex, claude, agents)', exitCode: 2 }
  );

  // Valid target
  assert.deepEqual(
    parseCliArgs(['--check', '--target', 'codex'], known),
    { apply: false, check: true, targetFilter: 'codex' }
  );

  // No --target: targetFilter is null
  assert.deepEqual(
    parseCliArgs(['--check'], known),
    { apply: false, check: true, targetFilter: null }
  );
});

test('applyPlan writes transformed content and never deletes', () => {
  const { source, target } = makeFixture();
  fs.mkdirSync(path.join(target, 'mystery-skill'), { recursive: true });
  const opts = {
    name: 't', sourceRoot: source, targetRoot: target,
    skills: ['skill-a', 'skill-b'], termPairs: [['Claude Code', 'Codex'], ['Claude', 'Codex']],
    unmanaged: [], ignore: []
  };
  applyPlan(planTarget(opts), opts);
  assert.equal(
    fs.readFileSync(path.join(target, 'skill-a', 'SKILL.md'), 'utf8'),
    'Use Codex here. Codex helps.'
  );
  assert.equal(fs.existsSync(path.join(target, 'mystery-skill')), true);
  const after = planTarget(opts);
  assert.deepEqual(after.missing, []);
  assert.deepEqual(after.modified, []);
});
