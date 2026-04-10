---
name: pumpingchops-content-polish
description: Improve PumpingChops review/guide copy and structure using AI as an editorial copilot. Use for intros, methodology, FAQs, tone cleanup, scannability, and trust consistency while preserving verified facts, product mappings, and affiliate link integrity.
---

# PumpingChops Content Polish

Use this skill to improve page quality without inventing product facts.

This is an **editorial enhancement skill**, not an auto-rewrite system.

## What This Skill Is For
- intro/subtitle cleanup
- tone alignment (less hype, more evidence-based)
- “Who this is for / not for”
- “How we chose” / methodology blocks
- FAQ drafting
- sources/reference formatting
- product block consistency (structure + wording)
- scannability improvements (TOC/jump links, quick picks summary)

## What This Skill Must Not Do
- invent or change product specs without verification
- change affiliate destinations without QA verification
- claim hands-on testing unless true
- overwrite author/policy positioning with generic affiliate copy
- mass rewrite pages without preserving structure and headings

## Required Workflow (Do Not Skip)

### 1) Run QA first
Before editing:
- `python3 scripts/page_qa.py --url '<url>'`

Use the output to target the copy/UI work:
- hype phrases
- FAQ mismatch
- generic sources
- placeholder overuse
- link hygiene flags (coordinate with QA, don’t blindly rewrite links)

### 2) Review rendered page
Use Playwright snapshot for:
- reading flow
- visual fatigue
- CTA repetition
- table placement
- spacing around long sections

### 3) Plan small edits
Prioritize:
- P0 trust/accuracy
- P1 intent/scannability
- P2 polish

Favor **surgical edits** over full rewrites.

## Editing Standards (PumpingChops)

### Voice / Tone
Target:
- practical
- technical but homeowner-readable
- conditional and specific
- transparent about methodology

Avoid:
- “you won’t regret”
- “awesome in every aspect”
- unsupported “trusted by millions”
- certainty where evidence is not shown

Prefer:
- “based on manufacturer specs/manuals…”
- “best if your setup has…”
- “strong option when…”
- “tradeoff to consider…”

### Product Block Template (recommended)
For each product section, standardize toward:
1. Product name (`H3`)
2. Best-for framing (`H4` or short line)
3. Snapshot specs (same order)
4. Pros/cons
5. Why we picked it
6. Fit / not fit for
7. Retail links
8. Source/spec links
9. Optional: “Specs verified on <date>”

### Sources / References
Generic “manufacturer pages and manuals” is not enough for premium pages.
Prefer:
- Product name — manufacturer page
- Product name — manual/spec sheet PDF
- Product name — warranty/support page (if relevant)

### FAQ Rule
If title/H1/meta says `FAQ` or `FAQs`, the page must include a real FAQ section.
Otherwise remove FAQ wording from title/H1/meta.

## Output Modes

### A) Patch Plan (default)
Return:
- exact sections to rewrite
- example revised wording
- what facts require verification before publishing

### B) Assisted Edit (when user asks)
Apply small changes directly:
- preserve headings and section structure
- preserve affiliate links unless explicitly fixing known mismatches
- re-run `page_qa.py` after edits

## Recommended Deliverable Format
```text
Page: <url>

Priority Fixes (P0)
1. ...

Copy/Tone Rewrites (P1)
- Current:
- Replace with:
- Why:

Structure / UX Improvements (P1/P2)
1. ...

Fact / Link Verification Needed Before Publish
- ...

Post-edit QA Checklist
- Run page_qa.py
- Check rendered layout
- Spot-check CTA destinations
```

## Related Project Assets
- QA script: `scripts/page_qa.py`
- Copy upgrade helper (batch patterns): `scripts/upgrade_top5_copy_blocks.py`
- Review page standards: `docs/seo/review-page-template.md`
- QA process doc: `docs/seo/page-qa-workflow.md`

