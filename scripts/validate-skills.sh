#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skills_dir="$repo_root/codex"

if [[ ! -d "$skills_dir" ]]; then
  echo "Missing skills directory: $skills_dir" >&2
  exit 1
fi

failures=0

while IFS= read -r -d '' skill_dir; do
  skill_name="$(basename "$skill_dir")"
  skill_file="$skill_dir/SKILL.md"

  if [[ ! -f "$skill_file" ]]; then
    echo "FAIL $skill_name: missing SKILL.md" >&2
    failures=$((failures + 1))
    continue
  fi

  first_line="$(sed -n '1p' "$skill_file")"
  end_line="$(sed -n '2,80{/^---$/=;}' "$skill_file" | head -1)"

  if [[ "$first_line" != "---" || -z "$end_line" ]]; then
    echo "FAIL $skill_name: missing YAML frontmatter fences" >&2
    failures=$((failures + 1))
    continue
  fi

  if ! sed -n "2,$((end_line - 1))p" "$skill_file" | grep -q '^name: '; then
    echo "FAIL $skill_name: missing name field" >&2
    failures=$((failures + 1))
  fi

  if ! sed -n "2,$((end_line - 1))p" "$skill_file" | grep -q '^description:'; then
    echo "FAIL $skill_name: missing description field" >&2
    failures=$((failures + 1))
  fi
done < <(find "$skills_dir" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)

if [[ "$failures" -gt 0 ]]; then
  echo "$failures skill validation failure(s)" >&2
  exit 1
fi

echo "skills ok"

# Installed-skill drift sensor: curated repo is source of truth.
echo "Checking installed skill dirs against manifest..."
node "$(dirname "$0")/sync-skills.mjs" --check
