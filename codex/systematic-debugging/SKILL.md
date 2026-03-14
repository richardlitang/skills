---
name: systematic-debugging
description: Use when debugging failures, crashes, or unexpected behavior. Enforces root cause investigation before fixes. Prevents random fix attempts.
user-invocable: true
---

# Systematic Debugging

## The Iron Law

> "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST"

**Symptom-focused fixes create technical debt and mask real issues.**

## The Four-Phase Process

### Phase 1: Root Cause Investigation

**Do NOT propose solutions yet.**

1. **Examine evidence carefully:**
   - Error messages (exact text)
   - Stack traces (every frame)
   - Line numbers and file paths
   - Logcat output (filter by app)

2. **Reproduce consistently:**
   ```bash
   # Run specific failing test
   ./gradlew testDebugUnitTest --tests "*FailingTest*"

   # Or reproduce in app
   adb logcat -s "Vector"
   ```

3. **Review recent changes:**
   ```bash
   git log --oneline -10
   git diff HEAD~3
   ```

4. **Trace data flow:**
   - Where does the data originate?
   - What transformations occur?
   - Where does it fail?

### Phase 2: Pattern Analysis

1. **Find working implementations:**
   - Similar features that work
   - Reference code in codebase
   - Official documentation

2. **Document differences:**
   | Working | Broken | Difference |
   |---------|--------|------------|
   | Uses X | Uses Y | ... |

3. **Check assumptions:**
   - Thread context (Main vs IO)?
   - Lifecycle state?
   - Null safety?
   - Permission state?

### Phase 3: Hypothesis Formation

**Write down your hypothesis before coding:**

```
Hypothesis: The crash occurs because [X] is called on [thread]
when [condition] is true, but [Y] expects [other thread].

Evidence: Stack trace shows [specific line], logcat shows [message].
```

**Test ONE variable at a time.**

### Phase 4: Targeted Fix

1. **Write failing test first** (TDD skill)
2. **Implement single, targeted fix**
3. **Verify fix with evidence:**
   ```bash
   ./gradlew testDebugUnitTest
   ```
4. **Verify no regressions**

## Red Flags (Stop Immediately)

### Restart Phase 1 If:

| Red Flag | Problem |
|----------|---------|
| Proposing fix before tracing data flow | Symptom-focused thinking |
| Multiple fixes at once | Can't isolate what worked |
| "It's probably X" without evidence | Assumption-based debugging |
| 3+ failed fix attempts | Likely architectural issue |
| Skipping reproduction | May not understand the bug |

### Rationalization Defense

| Excuse | Reality |
|--------|---------|
| "I know what's wrong" | Prove it with evidence |
| "Quick fix, then investigate" | Quick fixes become permanent |
| "Works on my machine" | Reproduce the exact failure |
| "Just try this" | Hypothesize first, then test |
| "Too complex to trace" | Break down into smaller pieces |

## Common Android Debugging Patterns

### Crash Analysis

```kotlin
// Check logcat for full stack trace
adb logcat -s "AndroidRuntime:E"

// Common causes:
// - NullPointerException: Missing null check
// - IllegalStateException: Wrong lifecycle state
// - ClassCastException: Type mismatch
```

### Compose Issues

```kotlin
// Add debugging
Modifier.debugInspectorInfo {
    name = "myModifier"
    properties["value"] = value
}

// Check recomposition count
@Composable
fun MyComponent() {
    SideEffect { Log.d("Recompose", "MyComponent") }
}
```

### Coroutine Issues

```kotlin
// Check dispatcher
Log.d("Debug", "Thread: ${Thread.currentThread().name}")

// Common issues:
// - UI update on wrong thread
// - Job cancellation
// - Exception swallowing
```

### Hilt Issues

```kotlin
// Missing @Inject constructor
// Missing @HiltViewModel
// Missing @AndroidEntryPoint
// Circular dependency
```

## When to Escalate

**After Phase 4, if:**
- Fix doesn't work after 3 attempts
- Issue seems architectural
- Requires changes outside current scope
- Involves unfamiliar library internals

**Use Context7 MCP** to check library documentation before more attempts.

## Verification Checklist

Before claiming "fixed":

- [ ] Root cause identified with evidence
- [ ] Hypothesis documented
- [ ] Single targeted fix applied
- [ ] Test proves fix works
- [ ] All other tests still pass
- [ ] Verified in actual app (not just tests)

## Related Skills

| When | Use |
|------|-----|
| Writing the fix | `/tdd-android` for test-first approach |
| Claiming "fixed" | `/verifying-completion` for evidence |
| Build errors | `/android-build` for Gradle troubleshooting |
| Library-specific issues | Context7 MCP (see `/android-build`) |

**Upstream pattern:** Adapted from [superpowers/systematic-debugging](https://github.com/obra/superpowers)
