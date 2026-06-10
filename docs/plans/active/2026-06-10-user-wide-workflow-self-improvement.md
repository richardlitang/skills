# User-Wide Workflow Self-Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the user-wide AI workflow self-correcting: mechanical drift sensors for skills and global config, a transcript-metrics reflection loop (via `tools/paxel-local`), and a human-approved retro skill that turns recurring failures into harness improvements.

**Architecture:** `personal/skills` becomes the single source of truth for reusable skills and user-wide sensor scripts; installed dirs (`~/.codex/skills`, `~/.claude/skills`, `~/.agents/skills`) become generated artifacts. `~/CLAUDE.md` stays the hand-edited global config; `~/AGENTS.md` is generated from it. Reflection data (paxel snapshots, retro notes) lives in private `~/.workflow/`, never in the public skills repo. The `personal/agents` harness-learning plan is amended (not duplicated) to cut the unsafe phases. All self-improvement is propose → human-approve → apply; nothing self-edits.

**Tech Stack:** Node 24 (`node:test`, no package.json needed), bash, Python 3 (paxel-local, already written).

**Repo:** `/Users/richardlitang/code/personal/skills` unless stated otherwise. Do not touch the pre-existing dirty files (`README.md` edit, untracked `codex/agent-mermaid/`) except where a task says so.

---

### Task 1: Skills sync — pure functions (manifest, term map, ignore, file listing)

**Files:**
- Create: `skills.manifest.json`
- Create: `scripts/sync-skills.mjs`
- Test: `scripts/sync-skills.test.mjs`

- [ ] **Step 1: Write the manifest**

```json
{
  "ignore": ["dist", ".system", "*.mp4"],
  "targets": {
    "codex": {
      "dir": "~/.codex/skills",
      "skills": "all",
      "exclude": ["wordpress-content-polish", "wordpress-guides-qa", "wordpress-page-qa"],
      "unmanaged": [".system", "pumpingchops-content-polish", "pumpingchops-guides-qa", "pumpingchops-page-qa"],
      "termPairs": []
    },
    "claude": {
      "dir": "~/.claude/skills",
      "skills": ["android-build", "auditing-flows", "brainstorming", "compose-ui", "localizing-android", "planning-features", "reviewing-code", "systematic-debugging", "tdd-android", "verifying-completion"],
      "unmanaged": [],
      "termPairs": []
    },
    "agents": {
      "dir": "~/.agents/skills",
      "skills": ["android-build", "auditing-flows", "brainstorming", "compose-ui", "localizing-android", "planning-features", "reviewing-code", "systematic-debugging", "tdd-android", "verifying-completion"],
      "unmanaged": [],
      "termPairs": [["Claude Code", "Codex"], ["Claude", "Codex"]]
    }
  }
}
```

Rationale locked in: the `wordpress-*`/`pumpingchops-*` trio is excluded from sync v1 (live copies are the personal originals; curated copies are sanitized public derivatives — opposite direction, handle later). `termPairs` is an ordered list, longest-match first, so "Claude Code" never becomes "Codex Code". This codifies the hand edits found live in `~/.agents/skills/android-build`.

- [ ] **Step 2: Write the failing tests for the pure functions**

```js
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd /Users/richardlitang/code/personal/skills && node --test scripts/sync-skills.test.mjs`
Expected: FAIL — `Cannot find module './sync-skills.mjs'`

- [ ] **Step 4: Implement the pure functions**

```js
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test scripts/sync-skills.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add skills.manifest.json scripts/sync-skills.mjs scripts/sync-skills.test.mjs
git commit -m "feat(sync): add skills sync manifest and pure helpers

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Skills sync — plan, apply, and CLI

**Files:**
- Modify: `scripts/sync-skills.mjs`
- Test: `scripts/sync-skills.test.mjs`

- [ ] **Step 1: Write the failing tests for planTarget and applyPlan**

Append to `scripts/sync-skills.test.mjs`:

```js
import { planTarget, applyPlan } from './sync-skills.mjs';

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'syncfix-'));
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
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `node --test scripts/sync-skills.test.mjs`
Expected: FAIL — `planTarget` is not exported.

- [ ] **Step 3: Implement planTarget, applyPlan, and the CLI**

Append to `scripts/sync-skills.mjs`:

```js
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

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const check = args.includes('--check') || !apply;
  const targetFilter = args.includes('--target') ? args[args.indexOf('--target') + 1] : null;
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
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
```

- [ ] **Step 4: Run all tests to verify they pass**

Run: `node --test scripts/sync-skills.test.mjs`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/sync-skills.mjs scripts/sync-skills.test.mjs
git commit -m "feat(sync): add plan/apply engine and CLI for installed skill dirs

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Reconcile live drift and first apply

**Files:**
- Modify: `scripts/validate-skills.sh` (append drift check)
- Modify: installed dirs `~/.codex/skills`, `~/.claude/skills`, `~/.agents/skills` (via `--apply`)

- [ ] **Step 1: Run check mode and review the diff list**

Run: `node scripts/sync-skills.mjs --check`
Expected: exit 1. Known acceptable drift only: `reviewing-code/SKILL.md` (description quoting, claude + agents targets), `android-build/SKILL.md` (Claude→Codex hand edits in agents target, now produced by termPairs so it should NOT appear modified — if it does, the termPairs output differs from the hand edit; inspect with `diff` and adjust `termPairs` or accept curated). Any file listed that is NOT one of these two means a live skill was hand-edited with content we'd overwrite: stop, diff it, and port intentional improvements into `codex/<skill>/` first.

- [ ] **Step 2: Apply to all three targets**

Run: `node scripts/sync-skills.mjs --apply`
Expected: per-target applied counts; no errors.

- [ ] **Step 3: Verify check is now clean**

Run: `node scripts/sync-skills.mjs --check && echo CLEAN`
Expected: `CLEAN` (exit 0; unknown dirs empty because pumpingchops/.system are listed unmanaged).

- [ ] **Step 4: Wire the drift sensor into validate-skills.sh**

Append to `scripts/validate-skills.sh`:

```bash
# Installed-skill drift sensor: curated repo is source of truth.
echo "Checking installed skill dirs against manifest..."
node "$(dirname "$0")/sync-skills.mjs" --check
```

- [ ] **Step 5: Run the full validator**

Run: `bash scripts/validate-skills.sh`
Expected: existing validation plus drift check, all passing.

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-skills.sh
git commit -m "feat(sync): enforce installed-skill drift check in validator

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Global config — generate ~/AGENTS.md from ~/CLAUDE.md

**Files:**
- Create: `scripts/sync-global-config.mjs`
- Test: `scripts/sync-global-config.test.mjs`
- Modify: `/Users/richardlitang/CLAUDE.md` (one line)
- Regenerate: `/Users/richardlitang/AGENTS.md`

- [ ] **Step 1: Fix the stale attribution line in ~/CLAUDE.md**

In `/Users/richardlitang/CLAUDE.md`, replace:
`- Add \`Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>\``
with:
`- Add \`Co-Authored-By: Claude <noreply@anthropic.com>\``

- [ ] **Step 2: Write the failing test**

```js
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test scripts/sync-global-config.test.mjs`
Expected: FAIL — module missing.

- [ ] **Step 4: Implement the generator**

```js
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
  const apply = process.argv.includes('--apply');
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test scripts/sync-global-config.test.mjs`
Expected: PASS (2 tests). The second test pins the substitution sources to the real file, so future `~/CLAUDE.md` edits that break the map fail loudly.

- [ ] **Step 6: Regenerate ~/AGENTS.md and verify the corruption is gone**

Run: `node scripts/sync-global-config.mjs --apply && grep -c "AGENTS.md/AGENTS.md\|Codex Opus\|.Codex/" ~/AGENTS.md`
Expected: regenerated message, then `0` from grep (grep exits 1 with count 0 — that is the pass condition).

- [ ] **Step 7: Wire into validate-skills.sh and commit**

Append to `scripts/validate-skills.sh`:

```bash
echo "Checking ~/AGENTS.md is generated from ~/CLAUDE.md..."
node "$(dirname "$0")/sync-global-config.mjs" --check
```

```bash
git add scripts/sync-global-config.mjs scripts/sync-global-config.test.mjs scripts/validate-skills.sh
git commit -m "feat(sync): generate ~/AGENTS.md from ~/CLAUDE.md with drift check

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Reflection loop — paxel snapshot wrapper and trend sensor

**Files:**
- Create: `scripts/reflect/snapshot-workflow-stats.sh`
- Create: `scripts/reflect/trend.mjs`
- Test: `scripts/reflect/trend.test.mjs`

Privacy rule (load-bearing): snapshots contain project names and work-hour data. They go to `~/.workflow/`, never into this public repo. The scripts here are generic and public; the data is not.

- [ ] **Step 1: Write the snapshot wrapper**

```bash
#!/usr/bin/env bash
# Snapshot paxel-local workflow metrics into ~/.workflow/snapshots/YYYY-MM-DD/.
set -euo pipefail
PAXEL_DIR="${PAXEL_DIR:-$HOME/code/tools/paxel-local}"
OUT_ROOT="${WORKFLOW_DATA_DIR:-$HOME/.workflow}/snapshots"
STAMP="$(date +%F)"
python3 "$PAXEL_DIR/paxel.py" --no-open > /dev/null
mkdir -p "$OUT_ROOT/$STAMP"
cp "$PAXEL_DIR/stats.json" "$PAXEL_DIR/report.md" "$OUT_ROOT/$STAMP/"
echo "$OUT_ROOT/$STAMP"
```

Note: `paxel.py` writes outputs next to itself (`OUT_DIR = script dir`, gitignored there); the wrapper copies them out.

- [ ] **Step 2: Run it once to verify**

Run: `bash scripts/reflect/snapshot-workflow-stats.sh && ls ~/.workflow/snapshots/$(date +%F)`
Expected: prints the snapshot dir; `ls` shows `stats.json report.md`.

- [ ] **Step 3: Write the failing trend tests**

```js
// scripts/reflect/trend.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { windowMetrics, flagFindings, TREND_TARGETS } from './trend.mjs';

const prev = {
  volume: { tool_calls_total: 1000 },
  behavior: { tool_errors: 50, shell_test_runs: 20, files_hammered_over_15x: 2,
              error_recovery_ratio: 0.8, planning_ratio_explore_to_doing: 1.1 }
};
const curr = {
  volume: { tool_calls_total: 2000 },
  behavior: { tool_errors: 200, shell_test_runs: 22, files_hammered_over_15x: 5,
              error_recovery_ratio: 0.6, planning_ratio_explore_to_doing: 0.9 }
};

test('windowMetrics computes per-window rates from cumulative counters', () => {
  const w = windowMetrics(prev, curr);
  assert.equal(w.tools_in_window, 1000);
  assert.equal(w.error_rate_per_100_tools, 15);
  assert.equal(w.test_runs_per_100_tools, 0.2);
  assert.equal(w.files_hammered_delta, 3);
});

test('flagFindings flags target violations with evidence values', () => {
  const flags = flagFindings(windowMetrics(prev, curr), TREND_TARGETS);
  const keys = flags.map((f) => f.metric);
  assert.ok(keys.includes('error_rate_per_100_tools'));
  assert.ok(keys.includes('test_runs_per_100_tools'));
  assert.ok(keys.includes('files_hammered_delta'));
  for (const f of flags) {
    assert.equal(typeof f.value, 'number');
    assert.equal(typeof f.target, 'string');
  }
});

test('flagFindings returns empty for a healthy window', () => {
  const healthy = {
    tools_in_window: 1000, error_rate_per_100_tools: 3,
    test_runs_per_100_tools: 2.5, files_hammered_delta: 0,
    error_recovery_ratio: 0.9, planning_ratio_explore_to_doing: 1.2
  };
  assert.deepEqual(flagFindings(healthy, TREND_TARGETS), []);
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `node --test scripts/reflect/trend.test.mjs`
Expected: FAIL — module missing.

- [ ] **Step 5: Implement trend.mjs**

```js
#!/usr/bin/env node
// scripts/reflect/trend.mjs
// Compare the two most recent paxel snapshots; flag workflow-health regressions.
// Usage: node scripts/reflect/trend.mjs [snapshotsDir]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Targets are policy, kept in one named map. Tune with evidence, not vibes.
export const TREND_TARGETS = {
  error_rate_per_100_tools: { max: 8, desc: 'tool errors per 100 calls in window' },
  test_runs_per_100_tools: { min: 1, desc: 'shell test runs per 100 tool calls in window' },
  files_hammered_delta: { max: 0, desc: 'new files edited >15x in window' },
  error_recovery_ratio: { min: 0.7, desc: 'cumulative recovered/total tool errors' },
  planning_ratio_explore_to_doing: { min: 0.5, desc: 'cumulative explore:produce ratio' }
};

export function windowMetrics(prev, curr) {
  const dTools = curr.volume.tool_calls_total - prev.volume.tool_calls_total;
  const dErrors = curr.behavior.tool_errors - prev.behavior.tool_errors;
  const dTests = curr.behavior.shell_test_runs - prev.behavior.shell_test_runs;
  const rate = (n) => (dTools > 0 ? Math.round((n / dTools) * 100 * 100) / 100 : 0);
  return {
    tools_in_window: dTools,
    error_rate_per_100_tools: rate(dErrors),
    test_runs_per_100_tools: rate(dTests),
    files_hammered_delta: curr.behavior.files_hammered_over_15x - prev.behavior.files_hammered_over_15x,
    error_recovery_ratio: curr.behavior.error_recovery_ratio,
    planning_ratio_explore_to_doing: curr.behavior.planning_ratio_explore_to_doing
  };
}

export function flagFindings(metrics, targets = TREND_TARGETS) {
  const flags = [];
  for (const [metric, rule] of Object.entries(targets)) {
    const value = metrics[metric];
    if (typeof value !== 'number') continue;
    if (rule.max !== undefined && value > rule.max) {
      flags.push({ metric, value, target: `<= ${rule.max}`, desc: rule.desc });
    }
    if (rule.min !== undefined && value < rule.min) {
      flags.push({ metric, value, target: `>= ${rule.min}`, desc: rule.desc });
    }
  }
  return flags;
}

function main() {
  const root = process.argv[2] || path.join(os.homedir(), '.workflow', 'snapshots');
  const days = fs.readdirSync(root).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  if (days.length < 2) {
    console.log(`Need 2+ snapshots in ${root}; found ${days.length}. Run snapshot-workflow-stats.sh again later.`);
    return;
  }
  const read = (d) => JSON.parse(fs.readFileSync(path.join(root, d, 'stats.json'), 'utf8'));
  const [prevDay, currDay] = days.slice(-2);
  const metrics = windowMetrics(read(prevDay), read(currDay));
  console.log(`# Workflow trend: ${prevDay} -> ${currDay}\n`);
  for (const [k, v] of Object.entries(metrics)) console.log(`- ${k}: ${v}`);
  const flags = flagFindings(metrics);
  console.log(`\n## Flags (${flags.length})\n`);
  for (const f of flags) console.log(`- **${f.metric}** = ${f.value} (target ${f.target}) — ${f.desc}`);
  if (!flags.length) console.log('- none, window is healthy');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `node --test scripts/reflect/trend.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add scripts/reflect/snapshot-workflow-stats.sh scripts/reflect/trend.mjs scripts/reflect/trend.test.mjs
git commit -m "feat(reflect): add paxel snapshot wrapper and trend sensor

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: workflow-retro skill (the human-approved self-improvement loop)

**Files:**
- Create: `codex/workflow-retro/SKILL.md`
- Modify: installed dirs via `node scripts/sync-skills.mjs --apply`

- [ ] **Step 1: Write the skill**

```markdown
---
name: workflow-retro
description: "Use weekly, or after a rough work session, to review AI workflow health. Snapshots local transcript metrics, diffs trends, runs drift sensors, and proposes at most 3 harness improvements for human approval. Non-mutating by default."
---

# Workflow Retro

Turn recurring workflow failures into harness improvements through an evidence -> proposal -> human approval loop. Never edit skills, config, or prompts directly from this skill.

## Steps

1. Run the drift sensors and capture output:
   - `bash ~/code/personal/skills/scripts/validate-skills.sh`
   - If drift is reported, that is finding #1 automatically.
2. Snapshot and trend transcript metrics:
   - `bash ~/code/personal/skills/scripts/reflect/snapshot-workflow-stats.sh`
   - `node ~/code/personal/skills/scripts/reflect/trend.mjs`
3. For each flagged metric, identify the likely cause by sampling recent sessions
   (project names are in the snapshot's `report.md`). Do not guess from the number alone.
4. Propose at most 3 improvement candidates. Each must include:
   - **kind**: `sensor` (new mechanical check), `skill` (new/edited skill in personal/skills),
     or `guide` (CLAUDE.md / project AGENTS.md change)
   - **evidence**: the flagged metric values and at least one concrete session example
   - **smallest change**: the minimal file-level edit that addresses it
5. Present candidates to the user for approval. Do not implement before approval.
6. Record the retro in `~/.workflow/retros/YYYY-MM-DD.md`: flags seen, candidates,
   decisions (approved/dismissed + why). Dismissals need a reason so they stay dismissed.
7. Approved changes are normal edits in `~/code/personal/skills` (then run
   `node scripts/sync-skills.mjs --apply`) or in the named repo. Never hand-edit
   installed skill dirs or ~/AGENTS.md.

## Rules

- Maximum 3 candidates per retro. Prefer one applied improvement over three ideas.
- Sensors over prose: if a failure repeats, propose a check before proposing more instructions.
- A candidate dismissed twice with the same evidence should be dropped, not re-proposed.
```

- [ ] **Step 2: Add the skill to the manifest's claude target**

In `skills.manifest.json`, add `"workflow-retro"` to the `claude` target's `skills` array (codex picks it up via `"all"`; leave `agents` out — retro runs from Claude Code or Codex, no need for three copies... add to `agents` only if you actually run retros there).

- [ ] **Step 3: Validate and install**

Run: `bash scripts/validate-skills.sh && node scripts/sync-skills.mjs --apply && node scripts/sync-skills.mjs --check && echo CLEAN`
Expected: validator passes, apply installs `workflow-retro` to codex + claude dirs, final `CLEAN`.

- [ ] **Step 4: Create the data dirs**

Run: `mkdir -p ~/.workflow/snapshots ~/.workflow/retros`

- [ ] **Step 5: Commit**

```bash
git add codex/workflow-retro/SKILL.md skills.manifest.json
git commit -m "feat(skills): add workflow-retro self-improvement loop skill

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Amend the personal/agents harness-learning plan (cut unsafe phases)

**Files:**
- Modify: `/Users/richardlitang/code/personal/agents/docs/plans/active/2026-06-08-harness-learning-approval-loop.md`

This task edits the plan document only; executing that plan happens in the agents repo on its own schedule, Task 0 (drift reconciliation) first.

- [ ] **Step 1: Cut Task 6 (apply tools)**

Replace the line `## Task 6: Add Apply Tools Only For Safe Artifact Types` with:

```markdown
## Task 6: Add Apply Tools Only For Safe Artifact Types

> **POSTPONED (2026-06-10 review):** An in-product file-writing tool duplicates what the
> operator coding agent already does under normal review, while adding an unattended write
> path. Revisit only after the draft flow (Task 5) has produced several human-applied
> improvements that demonstrably paid off. Drafts + manual apply is the supported flow.
```

(Keep the original task body below the note for future reference.)

- [ ] **Step 2: Cut Phase 4 from the rollout policy**

Replace:
`- Phase 4: prompt/guide edits only after multiple applied eval/sensor candidates prove the loop is reliable.`
with:
`- Phase 4: cut. Prompt/guide edits stay human-performed indefinitely; the loop proposes, humans edit.`

- [ ] **Step 3: Add a reason-taxonomy requirement to Task 1**

In Task 1's "Rules" list, append:

```markdown
- Verification reason strings used in `candidateId` derivation must come from an exported
  `VERIFICATION_REASON_CODES` constant in `packages/core/src/schemas.mjs`, with a schema test
  asserting every persisted candidate's `basis.reason` is either a listed code or a
  `probe_reason:` prefixed value. Dismissal memory depends on stable reason strings; free-form
  reasons silently resurrect dismissed candidates when renamed.
```

- [ ] **Step 4: Commit (in the agents repo)**

```bash
cd /Users/richardlitang/code/personal/agents
git add docs/plans/active/2026-06-08-harness-learning-approval-loop.md
git commit -m "docs(plans): postpone apply tools, cut prompt self-edits, pin reason taxonomy

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Documentation and final gate

**Files:**
- Modify: `README.md` (in personal/skills — note it already has an uncommitted edit; preserve it)

- [ ] **Step 1: Document the new infrastructure in README.md**

Add a section after "## Validate":

````markdown
## Sync (installed dirs are generated)

`~/.codex/skills`, `~/.claude/skills`, and `~/.agents/skills` are build artifacts of this
repo, driven by `skills.manifest.json`. Never hand-edit them.

```bash
node scripts/sync-skills.mjs --check   # drift sensor (also run by validate-skills.sh)
node scripts/sync-skills.mjs --apply   # install/update all targets
```

`~/AGENTS.md` is generated from `~/CLAUDE.md` the same way:

```bash
node scripts/sync-global-config.mjs --check | --apply
```

## Reflect (workflow self-improvement)

Weekly (or after a rough session), run the `workflow-retro` skill from any agent. Plumbing:

```bash
scripts/reflect/snapshot-workflow-stats.sh  # paxel-local metrics -> ~/.workflow/snapshots/
node scripts/reflect/trend.mjs              # flag regressions vs TREND_TARGETS
```

Snapshot data is private and stays in `~/.workflow/` — never commit it here.
````

- [ ] **Step 2: Run the full gate**

Run:
```bash
cd /Users/richardlitang/code/personal/skills
node --test scripts/
bash scripts/validate-skills.sh
node scripts/sync-skills.mjs --check
node scripts/sync-global-config.mjs --check
```
Expected: all pass / in sync.

- [ ] **Step 3: Commit**

```bash
git add README.md docs/plans/active/2026-06-10-user-wide-workflow-self-improvement.md
git commit -m "docs: document sync sensors and reflection loop

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Explicitly Not In This Plan

- Executing the agents-repo harness-learning plan (Tasks 0-5 there) — separate effort, in that repo, drift reconciliation first.
- Bidirectional sync for the `pumpingchops-*`/`wordpress-*` trio — direction is inverted (live is source); revisit when those skills next change.
- Renaming `codex/` -> `skills/` in the curated repo — layout debt, not load-bearing, would churn README and sync paths now.
- Any automated/cron retro — run `workflow-retro` manually until the loop has proven signal quality.
- Parsing Cursor/opencode transcripts in paxel — upstream limitation, not ours.

## Safety Gates (restated)

- Sync scripts never delete files; unknown dirs are reported, not removed.
- Reflection is propose-only; the retro skill requires human approval before any edit.
- Snapshot/retro data never enters the public repo.
- `~/AGENTS.md` and installed skill dirs are generated; the drift sensors in `validate-skills.sh` catch hand edits.
