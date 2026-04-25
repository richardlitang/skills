---
name: wordpress-guides-qa
description: Run WordPress guide-page QA for informational content quality, on-page SEO, trust signals, and publish readiness. Use for non-roundup how-to/explainer/FAQ/troubleshooting pages where intent coverage, structure, internal linking, and factual clarity matter more than product ranking.
---

# WordPress Guides QA

Use this skill to evaluate and improve WordPress informational guide posts before or after publish.

This is a report-first skill. Do not edit content unless the user asks.

## Scope Gate (required)
Apply this skill only to non-roundup guide pages.

Use this skill for slugs/pages like:
- `how-*`
- `what-is-*`
- `*troubleshooting*`
- `*faq*`
- `*advantages-and-disadvantages*`

Do not use this skill for:
- `/best-*` listicles/roundups
- product ranking/comparison posts with primary commercial intent

If the URL is `/best-*`, use `wordpress-page-qa` (and content polish/review workflow) instead.

## Core Principle
- Validate baseline issues with deterministic checks first (`scripts/page_qa.py`)
- Confirm real UX/readability with rendered-page inspection
- Score guide quality by intent coverage, trust, and SEO completeness

## Inputs
- `url` (preferred)
- optional mode: `quick` or `full` (default `full`)
- optional focus: `seo`, `trust`, `ux`, `content-depth`

## Workflow

### 1) Deterministic QA (required)
Run:
- `python3 scripts/page_qa.py --url '<url>'`

Classify:
- `error`: must-fix before publish
- `warn`: fix in current pass
- `info`: backlog/polish unless premium pass requested

### 2) Guide Intent Audit (required)
Confirm the page answers the search intent early and completely.

Check:
- opening section directly answers the core question
- heading structure reflects the promise in title/H1
- steps/explanations are complete and actionable
- edge cases and constraints are covered (size, compatibility, safety, failure modes)
- jargon is explained at first use
- conclusion gives a clear next action

### 3) On-Page SEO and Trust Audit (required)
Check:
- title/H1/meta alignment with user intent
- FAQ wording in title only when a real FAQ section exists
- internal links to related guides/reviews/categories
- outbound source links are specific (manual/spec pages where possible)
- freshness cues exist where needed (updated date/spec verification language)
- affiliate disclosure and sponsored/nofollow attributes remain compliant

### 4) Rendered UX Review (required for visual claims)
Use Playwright for the real page experience.

Check:
- mobile readability and section spacing
- TOC/jump-link usefulness for long guides
- table wrappers/captions and overflow handling
- CTA density is appropriate for informational pages (not overly sales-heavy)
- image relevance and placeholder misuse

### 5) Synthesis (required)
Return:
1. Deterministic findings
2. Intent-coverage findings
3. SEO/trust findings
4. Rendered UX findings
5. P0/P1/P2 action plan
6. Publish readiness verdict (`Ready`, `Ready with fixes`, `Not ready`)

Always label whether each finding is confirmed by:
- script only
- rendered review only
- both

## Guide-Specific Risk Patterns
Prioritize these recurring failures:
- title promises a guide/FAQ but body lacks corresponding sections
- generic sources section with no concrete citations
- thin explanatory content between headings
- overuse of commercial CTAs in informational guide sections
- no internal links to next-step pages (reviews, comparisons, troubleshooting)
- mismatch between claims and actual supporting context

## Output Format (recommended)
```text
Page: <url>
Mode: <quick|full>

Deterministic Findings
- ...

Intent Coverage Findings
- ...

SEO / Trust Findings
- ...

Rendered UX Findings
- ...

Highest-Impact Issues (P0)
1. ...

P1 Improvements
1. ...

P2 Polish
1. ...

Publish Readiness
- Verdict: <Ready | Ready with fixes | Not ready>
- Blockers: ...
```

## Guardrails
- Do not use this skill on `/best-*` pages.
- Do not invent facts or claim verified specs unless citations exist.
- Do not claim visual fixes without rendered confirmation.
- Do not change affiliate links in QA mode unless user explicitly asks for fixes.

## Related Project Assets
- Deterministic QA: `scripts/page_qa.py`
- QA process: `docs/seo/page-qa-workflow.md`
- Review template (for contrast checks): `docs/seo/review-page-template.md`
