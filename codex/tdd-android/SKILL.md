---
name: tdd-android
description: Use when implementing any feature, bugfix, or behavior change. Enforces RED-GREEN-REFACTOR cycle. Prevents writing production code before tests fail.
user-invocable: true
---

# Test-Driven Development for Android

## The Iron Law

> "If you didn't watch the test fail, you don't know if it tests the right thing."

**Production code CANNOT exist without a preceding failing test.**

## RED-GREEN-REFACTOR Cycle

### 🔴 RED: Write Failing Test

```kotlin
@Test
fun `addTask with empty title returns validation error`() {
    val result = useCase.invoke(Task(title = ""))

    assertThat(result).isInstanceOf(Result.Failure::class.java)
    assertThat((result as Result.Failure).error)
        .isEqualTo(VectorError.ValidationError("title"))
}
```

**Checklist:**
- [ ] Test name describes behavior clearly
- [ ] Single assertion per test
- [ ] Uses real implementations (avoid mocks unless necessary)

### Verify RED

```bash
./gradlew testDebugUnitTest --tests "*AddTaskUseCaseTest*"
```

**Must confirm:**
- [ ] Test FAILS (not errors)
- [ ] Failure message matches expectation
- [ ] Failure is because feature is missing

### 🟢 GREEN: Minimal Implementation

Write ONLY enough code to make the test pass. Nothing more.

```kotlin
class AddTaskUseCase @Inject constructor() {
    operator fun invoke(task: Task): Result<Task> {
        if (task.title.isBlank()) {
            return Result.failure(VectorError.ValidationError("title"))
        }
        // Minimal implementation only
    }
}
```

### Verify GREEN

```bash
./gradlew testDebugUnitTest
```

**Must confirm:**
- [ ] New test passes
- [ ] ALL other tests still pass
- [ ] No warnings or errors

### 🔄 REFACTOR: Clean Up

Only after green:
- Remove duplication
- Improve naming
- Extract helpers
- Clean up test setup

## Anti-Patterns (Red Flags)

### Stop and Restart If:

| Red Flag | Why It's Wrong |
|----------|----------------|
| Code written before test | Violates the iron law |
| Test passes immediately | Test doesn't test anything |
| "Keep as reference" rationale | Sunk cost fallacy |
| "Too simple to test" | Tests document behavior |
| "I'll write tests after" | Tests after don't verify TDD |
| Multiple behaviors in one test | Hard to diagnose failures |

### Rationalization Defense

| Excuse | Reality |
|--------|---------|
| "It's just a small change" | Small changes still need tests |
| "I manually tested it" | Manual tests aren't repeatable |
| "Tests slow me down" | Tests prevent regressions |
| "I know it works" | Prove it with a test |
| "The code is obvious" | Document the behavior anyway |

## Bug Fix Workflow

```
1. Write failing test that reproduces the bug
2. Verify test fails for the right reason
3. Fix the bug with minimal code
4. Verify test passes
5. Test now prevents regression
```

## Verification Checklist

Before marking work complete:

- [ ] Every new function has a preceding test
- [ ] Watched each test fail before implementing
- [ ] Used minimal code to pass tests
- [ ] All tests pass with clean output
- [ ] Mocks justified (prefer real implementations)
- [ ] Edge cases and error paths covered

## Android-Specific Patterns

### Testing ViewModels

```kotlin
@Test
fun `loadTasks emits loading then success`() = runTest {
    fakeRepository.setTasks(listOf(testTask))

    viewModel.uiState.test {
        assertThat(awaitItem().isLoading).isTrue()
        assertThat(awaitItem().tasks).containsExactly(testTask)
    }
}
```

### Testing Managers

```kotlin
class SpinManagerTest {
    private val manager = SpinManager()

    @Test
    fun `high streak returns high momentum`() {
        val state = manager.calculate(streak = 7, completed = 5)
        assertThat(state).isEqualTo(SpinState.HIGH_MOMENTUM)
    }
}
```

### Testing UseCases

```kotlin
@Test
fun `invoke validates and saves task`() = runTest {
    val task = Task(title = "Test")

    val result = useCase.invoke(task)

    assertThat(result.isSuccess).isTrue()
    assertThat(fakeRepository.savedTasks).contains(task)
}
```

## When NOT to Apply (Requires Approval)

- Throwaway prototypes (ask first)
- Generated code (Hilt, Room)
- Pure configuration changes
- XML layouts (use screenshot tests instead)

## Related Skills

| When | Use |
|------|-----|
| Before starting | `/planning-features` for multi-step work |
| Stuck on failing test | `/systematic-debugging` for root cause |
| Test passes, claiming done | `/verifying-completion` for evidence |
| Building UI components | `/compose-ui` for accessibility patterns |

**Upstream pattern:** Adapted from [superpowers/test-driven-development](https://github.com/obra/superpowers)
