// scripts/sync-skills.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyTermMap, isIgnored, listFiles } from './sync-skills.mjs';

test('applyTermMap applies ordered pairs, longest first', () => {
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
  fs.mkdirSync(path.join(dir, 'references'));
  fs.mkdirSync(path.join(dir, 'dist'));
  fs.writeFileSync(path.join(dir, 'SKILL.md'), 'x');
  fs.writeFileSync(path.join(dir, 'references', 'a.md'), 'x');
  fs.writeFileSync(path.join(dir, 'dist', 'junk.js'), 'x');
  assert.deepEqual(listFiles(dir, ['dist']), ['SKILL.md', 'references/a.md']);
});
