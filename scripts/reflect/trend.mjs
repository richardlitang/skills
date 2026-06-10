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
  // Negative values mean corpus shrinkage; they are reported but never flagged.
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
  if (!fs.existsSync(root)) { console.log(`No snapshots dir at ${root}. Run snapshot-workflow-stats.sh first.`); return; }
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
