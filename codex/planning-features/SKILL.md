---
name: planning-features
description: Use when implementing multi-step features or changes. Creates detailed implementation plans with 2-5 minute task granularity. Ensures clarity before coding.
---

# Feature Planning

## Core Principle

> "Assume engineers are skilled but lack domain knowledge. Be explicit."

Break work into bite-sized tasks (2-5 minutes each) with exact file paths, complete code, and specific commands.

## Plan Structure

```markdown
# Feature: [Name]

## Goal
[Single sentence describing what this achieves]

## Architecture Overview
[2-3 sentences explaining approach]

## Tech Stack
- [Relevant libraries/patterns]

## Tasks

### Task 1: [Description]
**Files:** `path/to/File.kt`
**Action:** Create/Modify/Test

[Complete code or specific changes]

**Verify:**
```bash
[Command to verify]
```

**Commit:** `type(scope): message`

---

### Task 2: [Description]
...
```

## Task Granularity

Each task = ONE discrete action:

| Good Task | Bad Task |
|-----------|----------|
| Write failing test for X | Implement feature |
| Verify test fails | Add tests |
| Implement minimal code for X | Fix stuff |
| Verify test passes | Make it work |
| Add string to strings.xml | Localization |

### Time Target: 2-5 Minutes

If a task takes longer, break it down further.

## Required Elements Per Task

1. **Exact file paths** - No ambiguity
2. **Complete code** - Not "add validation"
3. **Specific commands** - With expected output
4. **Commit message** - Conventional format

## Example Task

```markdown
### Task 3: Add validation to AddTaskUseCase

**Files:**
- Modify: `app/src/main/java/.../domain/usecase/AddTaskUseCase.kt`
- Modify: `app/src/test/java/.../AddTaskUseCaseTest.kt`

**Test first:**
```kotlin
@Test
fun `invoke with empty title returns validation error`() {
    val result = useCase.invoke(Task(title = ""))

    assertThat(result.isFailure).isTrue()
    assertThat(result.error).isEqualTo(VectorError.ValidationError("title"))
}
```

**Verify RED:**
```bash
./gradlew testDebugUnitTest --tests "*AddTaskUseCaseTest*"
# Expected: 1 test FAILED
```

**Implementation:**
```kotlin
operator fun invoke(task: Task): Result<Task> {
    if (task.title.isBlank()) {
        return Result.failure(VectorError.ValidationError("title"))
    }
    return taskRepository.save(task)
}
```

**Verify GREEN:**
```bash
./gradlew testDebugUnitTest --tests "*AddTaskUseCaseTest*"
# Expected: BUILD SUCCESSFUL
```

**Commit:** `feat(tasks): add title validation to AddTaskUseCase`
```

## Execution Options

### Option 1: Sequential (Recommended)

Execute tasks one by one with verification between each.

### Option 2: Batched

Execute 3 tasks, then pause for human review:

```
Tasks 1-3 completed:
- ✅ Task 1: Test written and failing
- ✅ Task 2: Implementation passes test
- ✅ Task 3: Edge case test added

Ready for feedback before continuing.
```

## Human Checkpoints

Pause and ask at these points:

1. **After planning** - "Does this plan look correct?"
2. **After each batch** - "Ready for feedback"
3. **On blockers** - "Hit issue X, how to proceed?"
4. **Before merge** - "All tasks complete, ready to merge?"

## Red Flags

### Stop and Revise Plan If:

| Red Flag | Action |
|----------|--------|
| Task is vague | Add specific code/commands |
| Task takes >5 min | Break into smaller tasks |
| Unclear what "done" means | Add verification step |
| Dependencies unclear | Reorder or document |
| Missing test task | Add TDD steps |

## Plan File Location

Save plans to: `docs/plans/YYYY-MM-DD-<feature-name>.md`

```bash
mkdir -p docs/plans
```

## Checklist Before Executing

- [ ] Plan reviewed and approved by user
- [ ] Each task has exact file paths
- [ ] Each task has complete code (not descriptions)
- [ ] Each task has verification command
- [ ] Tasks follow TDD (test → implement → verify)
- [ ] Time estimates reasonable (2-5 min each)
- [ ] Human checkpoints defined

## Related Skills

| When | Use |
|------|-----|
| Before planning | `/brainstorming` to clarify requirements |
| Executing each task | `/tdd-android` for test-first implementation |
| After each task | `/verifying-completion` for evidence |
| Adding UI in plan | `/compose-ui` + `/localizing-android` |

**Workflow:** `/brainstorming` → `/planning-features` → `/tdd-android` → `/verifying-completion`

**Upstream pattern:** Adapted from [superpowers/writing-plans](https://github.com/obra/superpowers)
