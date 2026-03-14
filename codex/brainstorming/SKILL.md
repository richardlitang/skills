---
name: brainstorming
description: Use when designing features, exploring approaches, or clarifying requirements. Socratic discovery through sequential questions before proposing solutions.
user-invocable: true
---

# Brainstorming & Design Discovery

## Core Principle

> "Design through dialogue, not dictation."

Transform raw ideas into validated designs through structured conversation BEFORE proposing solutions.

## The Socratic Process

### Phase 1: Understanding the Idea

**One question at a time.** Never overwhelm with multiple questions.

Focus on:
- Purpose: What problem does this solve?
- Constraints: What limitations exist?
- Success criteria: How do we know it's working?

**Prefer multiple-choice questions:**

```markdown
For the task filtering feature, which approach matches your vision?

A) Filter chips above the list (like Gmail labels)
B) Dropdown filter menu (compact, hidden until needed)
C) Side panel with filter options (more powerful, takes space)
D) Something else

Which feels right for Vector's "one screen, one message" philosophy?
```

### Phase 2: Exploring Approaches

**Present 2-3 options with trade-offs.** Lead with recommended option.

```markdown
## Approach Options

### Option A: Local-First (Recommended)
Store tasks in Room database, sync to cloud opportunistically.
- ✅ Works offline
- ✅ Fast UI updates
- ⚠️ Sync conflicts possible

### Option B: Cloud-First
Store in Firebase, cache locally.
- ✅ Always in sync
- ⚠️ Requires connectivity
- ⚠️ Slower perceived performance

### Option C: Hybrid
Local for active tasks, cloud for archive.
- ✅ Balance of both
- ⚠️ More complex

**Recommendation:** Option A aligns with ADHD-friendly instant feedback.

What resonates with you?
```

### Phase 3: Presenting the Design

Once understanding is solid, present in digestible chunks (200-300 words max per section).

**Checkpoint after each section:**

```markdown
## Data Model

[200 words describing the model]

Does this structure make sense before I continue to the UI components?
```

## Question Templates

### Clarifying Purpose
- "What specific problem does this feature solve for users?"
- "When would a user reach for this feature?"
- "What's the simplest version that would be useful?"

### Exploring Constraints
- "Are there performance requirements (speed, memory)?"
- "Does this need to work offline?"
- "Any accessibility requirements to consider?"

### Understanding Success
- "How will we know this feature is working well?"
- "What would a user say if this worked perfectly?"
- "What's the minimum we need for the first version?"

### Choosing Between Options
- "Given [constraint], would you prefer [A] or [B]?"
- "Which is more important here: [X] or [Y]?"
- "If you had to pick one, which?"

## Design Document Structure

After brainstorming, document the design:

```markdown
# Feature: [Name]

## Problem Statement
[What problem this solves]

## User Story
As a [user], I want to [action] so that [benefit].

## Proposed Solution
[High-level approach chosen]

## Architecture
[Components, data flow, key decisions]

## UI/UX
[Screens, interactions, edge cases]

## Technical Considerations
[Performance, security, accessibility, localization]

## Open Questions
[Anything still unresolved]

## Out of Scope
[What we're NOT doing in this version]
```

## YAGNI Ruthlessly

During brainstorming, actively prune:

| Proposed | Question | Outcome |
|----------|----------|---------|
| "Add sorting options" | "Do users need this now?" | Defer if no clear need |
| "Support 10 themes" | "What's minimum viable?" | Start with 2 themes |
| "Real-time sync" | "What's the simplest sync?" | Manual refresh first |

## Red Flags

### Stop and Recalibrate If:

| Flag | Issue |
|------|-------|
| Proposing solutions before questions | Didn't understand problem |
| User seems confused | Questions not clear enough |
| Design keeps growing | YAGNI not applied |
| No clear success criteria | Need to define done |
| Multiple concerns in one question | Break into separate questions |

## Post-Brainstorming Workflow

1. **Document** the design in `docs/designs/`
2. **Commit** the design document
3. **Confirm** readiness with user
4. **Plan** implementation (use `/planning-features`)
5. **Execute** with workspace isolation

## Related Skills

| When | Use |
|------|-----|
| After design approved | `/planning-features` for implementation plan |
| UI design decisions | `/compose-ui` for patterns |
| Analyzing user flows | `/auditing-flows` for journey mapping |

**Workflow:** `/brainstorming` → `/planning-features` → `/tdd-android` → `/verifying-completion`

**Upstream pattern:** Adapted from [superpowers/brainstorming](https://github.com/obra/superpowers)
