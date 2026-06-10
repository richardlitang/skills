# Skills

A curated set of agent skills, with the current collection focused on Codex workflows for software delivery, Android development, SEO analysis, UX writing, debugging, and review.

These skills are compact operating guides for coding agents. Each skill keeps the always-loaded trigger metadata small, then uses `SKILL.md`, references, scripts, and assets only when the task needs them.

## Highlights

- **Engineering workflow**: `systematic-debugging`, `verifying-completion`, `reviewing-code`, `planning-features`, `finding-duplicate-functions`
- **Architecture docs**: `agent-mermaid` for evidence-backed Mermaid diagrams from code.
- **Android**: `android-build`, `compose-ui`, `localizing-android`, `tdd-android`
- **Product and interface work**: `frontend-design`, `interface-design`, `ux-writing-skill`, `brainstorming`, `grill-me`
- **SEO and GEO**: `seo`, `seo-audit`, `seo-page`, `seo-technical`, `seo-schema`, `seo-content`, `seo-geo`, and focused helpers for images, sitemaps, hreflang, programmatic SEO, plans, and competitor pages
- **WordPress content workflows**: editorial polish and QA skills for repeatable guide, review, and affiliate-content operations

## Provenance

This repository is a curated copy of locally maintained user skills from `~/.codex/skills`, reorganized for public use under `codex/`.

The skills were inspired by recurring work patterns from personal projects, especially Android app development, WordPress content QA, SEO audits, code review, debugging, UX writing, and agent workflow design. They also draw on public documentation and commonly accepted practices from the relevant ecosystems, including Android and Jetpack Compose guidance, Google Search Central and Schema.org SEO references, Core Web Vitals guidance, WCAG accessibility guidance, and product-writing heuristics from UX writing practice.

System-provided Codex skills were not copied into this repo.

See [ATTRIBUTION.md](ATTRIBUTION.md) for the source-of-inspiration summary.

## Layout

```text
codex/
  <skill-name>/
    SKILL.md
    references/
    scripts/
    assets/
scripts/
  validate-skills.sh
```

Only `SKILL.md` is required for a skill. Supporting files are included when they materially reduce repeated work or preserve task-specific knowledge.

## Install

Copy the skills you want into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R codex/<skill-name> ~/.codex/skills/
```

To install all curated skills:

```bash
mkdir -p ~/.codex/skills
cp -R codex/* ~/.codex/skills/
```

Restart Codex after installing or updating skills so the metadata is reloaded.

## Validate

Run the lightweight repository check:

```bash
./scripts/validate-skills.sh
```

The validator checks that every skill directory has `SKILL.md`, YAML frontmatter fences, and required `name` and `description` fields.

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

Unattended mode: `scripts/reflect/weekly-healthcheck.sh` runs snapshot + trend + all drift
sensors, writes `~/.workflow/status.{txt,html}`, and notifies (macOS) only when something
needs attention. Pair it with a launchd `StartCalendarInterval` job and the SwiftBar plugin
`scripts/reflect/swiftbar-workflow-health.1d.sh` (symlink into the SwiftBar plugin dir) for
a menu bar health icon. The retro itself stays human-approved by design.

## Skill Index

| Skill | Purpose |
| --- | --- |
| `agent-mermaid` | Create evidence-backed Mermaid architecture diagrams from code. |
| `android-build` | Android build optimization, Gradle troubleshooting, and compile verification. |
| `auditing-flows` | Trace user journeys, logic paths, dead ends, and race-condition risks. |
| `brainstorming` | Clarify feature ideas and design direction through focused questioning. |
| `compose-ui` | Jetpack Compose UI patterns, accessibility, state, and responsive layouts. |
| `finding-duplicate-functions` | Audit codebases for semantic duplicate functions. |
| `frontend-design` | Build distinctive production-grade frontend interfaces. |
| `grill-me` | Stress-test plans or designs through direct interrogation. |
| `interface-design` | Design dense, operational app interfaces and dashboards. |
| `localizing-android` | Manage Android strings, translations, and localization audits. |
| `planning-features` | Break multi-step implementation work into concrete execution plans. |
| `reviewing-code` | Perform spec-first and quality-focused code reviews. |
| `seo` | Run broad SEO analysis, including technical, content, schema, and GEO checks. |
| `seo-audit` | Full-site SEO audit workflow with specialist decomposition. |
| `seo-competitor-pages` | Create SEO-focused comparison and alternatives pages. |
| `seo-content` | Analyze content quality, E-E-A-T, and citation readiness. |
| `seo-geo` | Optimize for AI Overviews, ChatGPT search, Perplexity, and AI citation surfaces. |
| `seo-hreflang` | Audit and generate hreflang implementations. |
| `seo-images` | Analyze image SEO, alt text, format, size, and loading behavior. |
| `seo-page` | Deep single-page SEO analysis. |
| `seo-plan` | Build strategic SEO plans and roadmaps. |
| `seo-programmatic` | Plan and audit programmatic SEO systems. |
| `seo-schema` | Detect, validate, and generate Schema.org JSON-LD. |
| `seo-sitemap` | Analyze or generate XML sitemaps. |
| `seo-technical` | Audit crawlability, indexability, rendering, performance, and security. |
| `systematic-debugging` | Debug failures through root-cause investigation before fixes. |
| `tdd-android` | Apply Android TDD for behavior changes. |
| `ux-writing-skill` | Write and audit product microcopy, errors, empty states, and UX content. |
| `verifying-completion` | Verify work before claiming it is complete or ready. |
| `wordpress-content-polish` | Polish WordPress review and guide copy while preserving factual integrity. |
| `wordpress-guides-qa` | QA informational WordPress guide pages for publish readiness. |
| `wordpress-page-qa` | QA WordPress review and roundup pages using deterministic and rendered checks. |
