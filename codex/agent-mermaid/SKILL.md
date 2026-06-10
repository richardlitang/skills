---
name: agent-mermaid
description: Create evidence-backed Mermaid architecture documentation from real code. Use when asked to generate, review, fix, or render Mermaid diagrams for repositories, agent systems, MCP servers, workflows, sequence flows, routing/control flow, data/state transformation, concurrency, error recovery, memory/persistence, or onboarding/design docs; especially when accuracy, source-backed relationships, explicit/inferred/unknown classification, and Mermaid syntax reliability matter.
---

# Agent Mermaid

## Operating Rule

Read code before drawing. Do not produce architecture diagrams from repository names, README claims, or likely framework conventions alone. Classify each relationship as explicit, inferred, or unknown.

## Workflow

1. Scope the request.
   - Identify the target repo, subsystem, or workflow.
   - Prefer 1-3 diagrams unless the code clearly warrants a larger package.
   - If the request names a specific output file, use it. Otherwise place durable repo diagrams in `docs/` or `docs/architecture/` when those paths exist.

2. Build a source inventory.
   - Read repo instructions, README, package/workspace manifests, and the relevant entrypoints.
   - Trace adapters to named workflows, domain modules, providers, persistence, config, and external services.
   - Use `references/patterns.md` when framework or architectural classification is needed.

3. Choose the diagram set.
   - Always consider a static architecture diagram.
   - Split static architecture into multiple views when the graph mixes inbound adapters, domain/workflow internals, provider integrations, and outputs.
   - Prefer clean directional views such as `inbound adapters -> core` and `core -> providers -> output` over one comprehensive graph with crossing edges.
   - Add a sequence diagram when runtime ordering matters.
   - Add routing/control-flow when branching, retries, queues, or state transitions matter.
   - Add data/state, memory/persistence, concurrency, or error/recovery diagrams only when source evidence supports them.

4. Draft Mermaid with evidence discipline.
   - Show explicit relationships with normal solid edges.
   - Show inferred relationships with dashed edges and explain the inference.
   - Mark unknown or external systems as uncertain instead of inventing internals.
   - Keep diagrams readable. Split rather than creating a dense all-in-one chart.

5. Validate before delivering.
   - Read `references/syntax-guard.md` before finalizing non-trivial Mermaid.
   - Prefer simple Mermaid constructs that render in GitHub Markdown.
   - Run a local renderer/check when available (`mmdc`, Mermaid MCP, or docs pipeline). If no renderer is available, perform a manual syntax pass and say so.

6. Package the result.
   - Include a short evidence note listing key files read.
   - Include assumptions and inferred relationships separately.
   - For repo docs, commit Mermaid source in Markdown fenced blocks unless the repo already uses `.mmd`.

## Diagram Selection

Use this default order:

| Diagram | Use when |
| --- | --- |
| System architecture | Any repo, app, or subsystem architecture request. |
| Primary sequence | User workflow, request lifecycle, rendering pipeline, agent loop, or job orchestration. |
| Routing/control flow | Branching, queues, retries, cancellation, fallback, or state transitions. |
| Data/state transformation | Canonical schemas, generated artifacts, normalization, migrations, or persistence shape matter. |
| Error/recovery | Recovery paths are explicit and relevant to the request. |
| Memory/persistence lifecycle | Databases, checkpoints, caches, vector stores, local state, or run history are central. |

## Output Template

```markdown
# <System> Architecture Diagram

Generated: <date>
Scope: <repo/subsystem>
Evidence: <key files read>

## Diagram

```mermaid
flowchart LR
  ...
```

## Notes

- Explicit: ...
- Inferred: ...
- Unknown: ...
- Risks or review notes: ...
```

## MCP Guidance

Use a skill-only workflow when the user needs source-backed analysis and durable docs. Add a Mermaid MCP or CLI only when rendering, image export, live preview, or syntax validation is required. The MCP should validate/render the diagram; it should not replace the code inventory and evidence classification.
