# User-Wide Workflow Architecture

Generated: 2026-06-10
Scope: personal/skills sync + reflection infrastructure, plus the machine-local automation it drives
Evidence: skills.manifest.json, scripts/sync-skills.mjs, scripts/sync-global-config.mjs, scripts/validate-skills.sh, scripts/reflect/weekly-healthcheck.sh, scripts/reflect/trend.mjs, scripts/reflect/swiftbar-workflow-health.1d.sh, codex/workflow-retro/SKILL.md, ~/Library/LaunchAgents/com.richardlitang.workflow-healthcheck.plist

## View 1: Where things live — you edit two places, everything else is generated

```mermaid
flowchart LR
  subgraph truth["You edit ONLY these"]
    claudemd["~/CLAUDE.md - global defaults"]
    repo["personal/skills repo - curated skills + manifest"]
  end

  subgraph scripts["Deterministic sync scripts"]
    gsync["sync-global-config.mjs"]
    ssync["sync-skills.mjs"]
  end

  subgraph generated["Generated - never hand-edit"]
    agentsmd["~/AGENTS.md"]
    cskills["~/.claude/skills"]
    xskills["~/.codex/skills"]
    askills["~/.agents/skills"]
  end

  claudemd --> gsync --> agentsmd
  repo --> ssync
  ssync --> cskills
  ssync --> xskills
  ssync -- "Claude-to-Codex term map" --> askills
```

`validate-skills.sh` runs both sync scripts in `--check` mode: if a generated file
drifts from its source, the validator fails and the weekly healthcheck notifies.
Sync never deletes; unknown files are reported, not removed.

## View 2: What happens Monday and Thursday 09:30 — fully automatic, zero LLM, zero network

```mermaid
sequenceDiagram
  participant L as launchd
  participant H as weekly-healthcheck.sh
  participant P as paxel-local
  participant T as trend.mjs
  participant D as drift sensors
  participant S as SwiftBar icon
  participant U as You

  L->>H: run (Mon + Thu 09:30)
  H->>P: parse local transcripts
  P-->>H: stats.json snapshot
  H->>T: compare last two snapshots
  T-->>H: flags vs calibrated targets
  H->>D: skills and AGENTS.md in sync?
  D-->>H: drift list
  H->>S: status green or orange
  alt something needs attention
    H->>U: macOS notification
  else all clear
    H-->>U: silence
  end
```

Metrics watched (calibrated to the 2026-06-10 baseline): test runs per 100 tool
calls (min 1.5), error rate (max 2), new hammered files (max 0), error recovery
(min 0.7), planning ratio (min 0.6). All data stays in `~/.workflow/`, private.

## View 3: How the workflow improves itself — LLM and human enter only here

```mermaid
flowchart TD
  icon["Orange icon or notification"] --> retro["workflow-retro skill - investigates flags with session evidence"]
  retro --> proposals["Up to 3 proposals - sensor, skill, or guide change"]
  proposals --> gate{"You approve?"}
  gate -- "no, with reason" --> log["~/.workflow/retros - stays dismissed"]
  gate -- "yes" --> edit["Edit the sources of truth"]
  edit --> sync["Sync scripts apply"]
  sync --> watch["Sensors watch the next window"]
  watch --> icon
```

## Notes

- Explicit: every edge above is backed by code written and tested 2026-06-10
  (sync engine 9 tests, global-config 2 tests, trend 4 tests; launchd job loaded
  and verified; SwiftBar plugin symlinked and output-tested).
- Inferred: none.
- Unknown/external: paxel-local internals are upstream code (read, not owned);
  its codex-source error counting is known to undercount (string outputs carry
  no success flag), so error metrics bind mainly on claude-source windows.
- Out of scope: personal/agents (blindspot) runs its own product-internal
  harness-learning loop mirroring the same propose-then-approve pattern.
