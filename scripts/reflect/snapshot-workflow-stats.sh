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
