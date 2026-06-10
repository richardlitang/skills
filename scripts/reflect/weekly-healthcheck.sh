#!/usr/bin/env bash
# Weekly workflow healthcheck: snapshot transcript metrics, compute trend,
# run drift sensors. Writes ~/.workflow/status.txt + status.html and sends a
# macOS notification only when something needs human attention.
# Designed to run unattended from launchd (see README, Reflect section).
set -uo pipefail

# GUI launchers (SwiftBar, launchd) have a bare PATH; find node if missing.
if ! command -v node > /dev/null 2>&1; then
  for d in "$HOME/.nvm/versions/node"/*/bin /opt/homebrew/bin /usr/local/bin; do
    if [ -x "$d/node" ]; then PATH="$d:$PATH"; fi
  done
  export PATH
fi

SKILLS_REPO="${SKILLS_REPO:-$HOME/code/personal/skills}"
WF="${WORKFLOW_DATA_DIR:-$HOME/.workflow}"
LOG="$WF/healthcheck.log"
mkdir -p "$WF"
echo "--- healthcheck $(date '+%F %T') ---" >> "$LOG"

issues=()

# 1. Snapshot metrics (paxel-local; slow, minutes).
if ! bash "$SKILLS_REPO/scripts/reflect/snapshot-workflow-stats.sh" >> "$LOG" 2>&1; then
  issues+=("metrics snapshot failed (see ~/.workflow/healthcheck.log)")
fi

# 2. Trend flags.
trend_md="$(node "$SKILLS_REPO/scripts/reflect/trend.mjs" 2>> "$LOG" || true)"
flags="$(printf '%s\n' "$trend_md" | sed -n 's/^## Flags (\([0-9][0-9]*\)).*/\1/p')"
flags="${flags:-0}"
if [ "$flags" -gt 0 ]; then
  issues+=("$flags workflow metric flag(s) - run the workflow-retro skill")
fi

# 3. Drift sensors.
if ! node "$SKILLS_REPO/scripts/sync-skills.mjs" --check > "$WF/last-skill-drift.txt" 2>&1; then
  issues+=("installed skill dirs drift from curated repo (see ~/.workflow/last-skill-drift.txt)")
fi
if ! node "$SKILLS_REPO/scripts/sync-global-config.mjs" --check >> "$LOG" 2>&1; then
  issues+=("~/AGENTS.md out of sync with ~/CLAUDE.md - run sync-global-config.mjs --apply")
fi

# 4. Status files (read by the SwiftBar plugin and the human).
stamp="$(date '+%F %H:%M')"
{
  echo "${#issues[@]}"
  echo "$stamp"
  if [ "${#issues[@]}" -gt 0 ]; then printf '%s\n' "${issues[@]}"; fi
} > "$WF/status.txt"

{
  echo "<!doctype html><meta charset='utf-8'><title>Workflow Health</title>"
  echo "<style>body{font:14px/1.5 -apple-system,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#1a1a1a}h1{font-size:20px}pre{background:#f5f5f5;padding:12px;border-radius:8px;overflow-x:auto}.ok{color:#1a7f37}.bad{color:#b35900}li{margin:4px 0}</style>"
  echo "<h1>Workflow Health <small style='color:#888;font-weight:normal'>$stamp</small></h1>"
  if [ "${#issues[@]}" -eq 0 ]; then
    echo "<p class='ok'>All clear. No drift, no metric flags.</p>"
  else
    echo "<p class='bad'>Needs attention:</p><ul>"
    for i in "${issues[@]}"; do echo "<li>$i</li>"; done
    echo "</ul>"
  fi
  echo "<h2>Latest trend</h2><pre>$trend_md</pre>"
  echo "<p style='color:#888'>Data: ~/.workflow/ &middot; Sensors: personal/skills/scripts/ &middot; Fix flow: run the <code>workflow-retro</code> skill in Claude Code or Codex.</p>"
} > "$WF/status.html"

# 5. Notify only when action is needed.
if [ "${#issues[@]}" -gt 0 ]; then
  first="${issues[0]}"
  osascript -e "display notification \"$first\" with title \"Workflow Health\" subtitle \"${#issues[@]} item(s) need attention\"" 2>> "$LOG" || true
fi

echo "healthcheck done: ${#issues[@]} issue(s)" | tee -a "$LOG"
