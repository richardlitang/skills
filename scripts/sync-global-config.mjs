#!/usr/bin/env node
// scripts/sync-global-config.mjs
// Generate ~/AGENTS.md from ~/CLAUDE.md. Never hand-edit ~/AGENTS.md.
// Usage: node scripts/sync-global-config.mjs --check | --apply
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const SOURCE = `${os.homedir()}/CLAUDE.md`;
const DEST = `${os.homedir()}/AGENTS.md`;

export const SUBSTITUTIONS = [
  [
    'Add `Co-Authored-By: Claude <noreply@anthropic.com>`',
    'Add a `Co-Authored-By` trailer naming the agent (e.g. `Co-Authored-By: Codex <noreply@openai.com>`)'
  ],
  [
    "defined in the project's CLAUDE.md or .claude/ directory",
    "defined in the project's AGENTS.md/CLAUDE.md or the agent's config directory"
  ],
  [
    'Run `/compact` proactively',
    "Run the agent's context-compaction command (such as `/compact`) proactively"
  ]
];

const HEADER = '<!-- GENERATED from ~/CLAUDE.md by personal/skills/scripts/sync-global-config.mjs. Do not hand-edit. -->\n';

export function renderAgentsMd(source) {
  let out = source;
  for (const [from, to] of SUBSTITUTIONS) out = out.split(from).join(to);
  return HEADER + out;
}

function main() {
  const args = process.argv.slice(2);
  const known = new Set(['--check', '--apply']);
  for (const arg of args) {
    if (!known.has(arg)) {
      process.stderr.write(`error: unknown argument "${arg}" (expected --check or --apply)\n`);
      process.exit(2);
    }
  }
  const apply = args.includes('--apply');
  const expected = renderAgentsMd(fs.readFileSync(SOURCE, 'utf8'));
  const current = fs.existsSync(DEST) ? fs.readFileSync(DEST, 'utf8') : '';
  if (expected === current) {
    console.log('~/AGENTS.md is in sync.');
    return;
  }
  if (apply) {
    fs.writeFileSync(DEST, expected);
    console.log('~/AGENTS.md regenerated.');
  } else {
    console.error('~/AGENTS.md is out of sync with ~/CLAUDE.md. Run with --apply.');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
