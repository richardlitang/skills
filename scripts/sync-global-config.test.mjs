// scripts/sync-global-config.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAgentsMd, SUBSTITUTIONS } from './sync-global-config.mjs';

test('renderAgentsMd prepends generated header and applies ordered substitutions', () => {
  const src = [
    '# Global Development Guidelines',
    '- Add `Co-Authored-By: Claude <noreply@anthropic.com>`',
    "- Use project-specific skills defined in the project's CLAUDE.md or .claude/ directory.",
    '- Run `/compact` proactively when needed.'
  ].join('\n');
  const out = renderAgentsMd(src);
  assert.match(out, /^<!-- GENERATED from ~\/CLAUDE\.md/);
  assert.doesNotMatch(out, /Claude Opus/);
  assert.match(out, /Co-Authored-By` trailer naming the agent/);
  assert.match(out, /AGENTS\.md\/CLAUDE\.md or the agent's config directory/);
  assert.match(out, /context-compaction command \(such as `\/compact`\)/);
});

test('substitution sources actually exist in current ~/CLAUDE.md', async () => {
  const fs = await import('node:fs');
  const os = await import('node:os');
  const src = fs.readFileSync(`${os.homedir()}/CLAUDE.md`, 'utf8');
  for (const [from] of SUBSTITUTIONS) {
    assert.equal(src.includes(from), true, `stale substitution source: ${from}`);
  }
});
