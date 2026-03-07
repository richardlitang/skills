# Codex Skills

A curated set of Codex skills for software delivery, Android development, SEO analysis, UX writing, debugging, and review workflows.

These skills are designed as compact operating guides for coding agents. Each skill keeps the always-loaded trigger metadata small, then uses `SKILL.md`, references, scripts, and assets only when the task needs them.

## Highlights

- **Engineering workflow**: `systematic-debugging`, `verifying-completion`, `reviewing-code`, `planning-features`, `finding-duplicate-functions`
- **Android**: `android-build`, `compose-ui`, `localizing-android`, `tdd-android`
- **Product and interface work**: `frontend-design`, `interface-design`, `ux-writing-skill`, `brainstorming`, `grill-me`
- **SEO and GEO**: `seo`, `seo-audit`, `seo-page`, `seo-technical`, `seo-schema`, `seo-content`, `seo-geo`, and focused helpers for images, sitemaps, hreflang, programmatic SEO, plans, and competitor pages
- **Domain workflows**: PumpingChops content polish and QA skills for repeatable affiliate/content operations

## Layout

```text
skills/
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
cp -R skills/<skill-name> ~/.codex/skills/
```

To install all curated skills:

```bash
mkdir -p ~/.codex/skills
cp -R skills/* ~/.codex/skills/
```

Restart Codex after installing or updating skills so the metadata is reloaded.

## Validate

Run the lightweight repository check:

```bash
./scripts/validate-skills.sh
```

The validator checks that every skill directory has `SKILL.md`, YAML frontmatter fences, and required `name` and `description` fields.

## Skill Index

| Skill | Purpose |
| --- | --- |
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
| `pumpingchops-content-polish` | Polish PumpingChops review and guide copy while preserving factual integrity. |
| `pumpingchops-guides-qa` | QA informational PumpingChops guide pages for publish readiness. |
| `pumpingchops-page-qa` | QA PumpingChops review and roundup pages using deterministic and rendered checks. |
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
