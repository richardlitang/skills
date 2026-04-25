---
name: wordpress-page-qa
description: Run WordPress page QA using a local deterministic audit script plus rendered-page review with Playwright, then synthesize findings into prioritized fixes and template/workflow learnings. Use for current or future pages, especially affiliate review and roundup posts.
---

# WordPress Page QA

Use this skill when reviewing any WordPress content page for:
- layout/UX regressions
- affiliate link hygiene
- trust/SEO structure quality
- recurring template issues that should become standards

This skill is **report-first** by default. Do not auto-edit content unless the user asks.

## Core Principle
- Use deterministic checks first (`scripts/page_qa.py`)
- Then inspect rendered reality (Playwright)
- Then synthesize (P0/P1/P2 + template learnings)

## Inputs
- `url` (preferred), e.g. `https://example.com/best-product-category/`
- optional `post_type` (`post`, `page`) for batch QA
- optional `limit` for batch QA samples
- mode: `quick` or `full` (default `full`)

## Workflow

### 1) Deterministic QA (required)
Run:
- Single page: `python3 scripts/page_qa.py --url '<url>'`
- Batch posts: `python3 scripts/page_qa.py --post-type post --limit <N>`
- Batch pages: `python3 scripts/page_qa.py --post-type page --limit <N>`

Read the output and classify:
- `error` = must-fix before publish
- `warn` = fix in current pass when possible
- `info` = polish/backlog unless user asked for premium pass

### 2) Rendered Page Review (required for UI claims)
Use Playwright to inspect actual rendered page:
- snapshot for structure
- computed layout metrics for:
  - table alignment/caption width
  - overflow/mobile wrappers
  - content container padding/width
  - hero image presence and placeholder misuse
  - CTA button wrapping density

Do not rely on raw HTML alone when the user reports spacing/alignment issues.

### 3) Synthesis (required)
Produce a report with:
1. `Deterministic findings` (script output summary)
2. `Rendered-page findings` (what users actually see)
3. `Highest impact blockers` (trust/conversion/SEO)
4. `P0 / P1 / P2 fix plan`
5. `Template/workflow learnings` (what should be encoded into shared renderer/docs/scripts)

Always call out if a finding is:
- confirmed by script only
- confirmed by Playwright only
- confirmed by both

## WordPress Affiliate Content Checks to Emphasize
- affiliate CTA mismatch risk (duplicate destinations across product sections)
- missing/incorrect `rel="nofollow sponsored noopener"`
- placeholder product image overuse
- placeholder image used as hero featured image (must not happen)
- comparison table caption and responsive table wrapper
- CTA rows below data rows in comparison tables
- redundant category row under breadcrumbs
- title/H1/section mismatch (e.g., FAQ in title but no FAQ section)
- generic sources section without actual source links
- hype-heavy copy that conflicts with research-backed editorial tone

## Output Format (recommended)
Use this structure:

```text
Page: <url>
Score (script): <n>/100

Deterministic Findings
- ...

Rendered Findings
- ...

Highest-Impact Issues (P0)
1. ...

P1 Improvements
1. ...

P2 Polish
1. ...

Template / Workflow Learnings
- Add/adjust ...
```

## Guardrails
- Do not claim a link is “wrong” unless you verified product/model mismatch by destination or repeated mapping evidence.
- Do not claim visual fixes are live without a rendered check.
- Do not rewrite content in this skill unless explicitly asked; produce a patch plan first.

## Related Project Assets
- Deterministic QA: `scripts/page_qa.py`
- Review standards: `docs/seo/review-page-template.md`
- QA workflow doc: `docs/seo/page-qa-workflow.md`
- Rendering logic (for root-cause tracing): site-specific WordPress theme or plugin templates
