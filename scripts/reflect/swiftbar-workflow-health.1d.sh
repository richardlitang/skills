#!/usr/bin/env bash
# SwiftBar plugin: workflow health in the menu bar.
# Install: symlink into the SwiftBar plugin directory. Refreshes daily (.1d)
# and on demand; reads ~/.workflow/status.txt written by weekly-healthcheck.sh.
WF="$HOME/.workflow"
STATUS="$WF/status.txt"
HEALTHCHECK="$HOME/code/personal/skills/scripts/reflect/weekly-healthcheck.sh"

if [ ! -f "$STATUS" ]; then
  echo "WF ?"
  echo "---"
  echo "No healthcheck has run yet"
  echo "Run healthcheck now | bash=$HEALTHCHECK terminal=false refresh=true"
  exit 0
fi

count="$(sed -n '1p' "$STATUS")"
stamp="$(sed -n '2p' "$STATUS")"

if [ "$count" = "0" ]; then
  echo ":checkmark.seal: | sfcolor=#1a7f37"
else
  echo ":exclamationmark.triangle: $count | sfcolor=#b35900"
fi
echo "---"
echo "Workflow health - last check $stamp"
if [ "$count" != "0" ]; then
  tail -n +3 "$STATUS" | while IFS= read -r line; do
    echo "$line | color=#b35900"
  done
fi
echo "---"
echo "Open status page | bash=/usr/bin/open param1=$WF/status.html terminal=false"
echo "Run healthcheck now | bash=$HEALTHCHECK terminal=false refresh=true"
echo "Open snapshots folder | bash=/usr/bin/open param1=$WF terminal=false"
