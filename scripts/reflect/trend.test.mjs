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
