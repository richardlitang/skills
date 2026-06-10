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
