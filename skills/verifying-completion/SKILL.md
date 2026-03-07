---
name: verifying-completion
description: Use before claiming ANY work is complete, fixed, passing, or ready. Enforces evidence-based verification. Prevents false completion claims.
user-invocable: true
---

# Verification Before Completion

## The Iron Law

> "Evidence before claims, always."

**Run verification commands and confirm output BEFORE asserting work is complete.**

## The Five-Step Gate

Before ANY completion claim:

1. **IDENTIFY** the command that proves your claim
2. **RUN** the command freshly (no cached results)
3. **READ** full output, exit codes, failure counts
4. **VERIFY** output actually confirms the claim
5. **ONLY THEN** make the claim with evidence

**Skipping any step = invalid claim.**

## Verification Commands

### "Tests Pass"

```bash
./gradlew testDebugUnitTest

# Expected: BUILD SUCCESSFUL
# Check: 0 failures, 0 errors
```

### "Code Compiles"

```bash
./quick-check.sh
# OR
./gradlew assembleDebug

# Expected: BUILD SUCCESSFUL
```

### "Lint Clean"

```bash
./gradlew lintDebug

# Expected: No errors (warnings may be acceptable)
```

### "Localization Complete"

```bash
# All counts must match
for f in values values-es values-de values-fr values-pt values-ja values-hi values-tl; do
  echo "$f: $(grep '<string name=' app/src/main/res/$f/strings.xml | wc -l)"
done
```

### "Bug Fixed"

```bash
# 1. Run test that reproduces bug
./gradlew testDebugUnitTest --tests "*BugReproductionTest*"

# 2. Verify test passes now
# 3. Verify original symptom gone in app
```

## Red Flags (Stop Immediately)

### Language That Violates This Skill:

| Pattern | Problem |
|---------|---------|
| "Should pass" | Run it and prove it |
| "Probably works" | Verify it works |
| "Seems fixed" | Confirm it's fixed |
| "I think it's done" | Know it's done |
| "Let me commit this" | Verify before commit |

### Common Verification Failures:

| Claim | Insufficient Evidence |
|-------|----------------------|
| "Tests pass" | Didn't run tests |
| "Build succeeds" | Assumed from lint pass |
| "Bug fixed" | Changed code, didn't test symptom |
| "Feature complete" | Didn't verify requirements |
| "All strings translated" | Didn't count strings |

## Verification Checklist by Task Type

### After Implementing Feature:

- [ ] All new tests pass
- [ ] All existing tests pass
- [ ] Build succeeds
- [ ] Feature works in app (manual check)
- [ ] Edge cases handled

### After Bug Fix:

- [ ] Reproduction test written and passes
- [ ] Original symptom verified gone
- [ ] No regressions introduced

### After Refactoring:

- [ ] All tests pass (behavior unchanged)
- [ ] No new warnings
- [ ] Performance not degraded

### After Adding Strings:

- [ ] String counts match across all 8 files
- [ ] Str.kt function added
- [ ] Used in UI correctly

### Before Commit:

- [ ] `./gradlew assembleDebug` succeeds
- [ ] `./gradlew testDebugUnitTest` passes
- [ ] No unintended file changes
- [ ] Commit message accurate

### Before PR:

- [ ] All above checks pass
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] PR description accurate

## Evidence Format

When claiming completion, provide evidence:

```
✅ Tests pass:
   BUILD SUCCESSFUL in 45s
   42 tests, 0 failures

✅ Build succeeds:
   BUILD SUCCESSFUL in 1m 23s

✅ Strings localized:
   values:    156 strings
   values-es: 156 strings
   values-de: 156 strings
   (all match)
```

## Rationalization Defense

| Excuse | Reality |
|--------|---------|
| "I just ran it" | Run it again to confirm |
| "It was working before" | Verify current state |
| "Small change, can't break" | Small changes do break things |
| "Tests are slow" | Correctness > speed |
| "I'll verify later" | Verify now |

## When to Pause

**Ask the user** if:
- Verification reveals unexpected issues
- Tests fail for unrelated reasons
- Build fails with unfamiliar errors
- Unsure what command proves the claim

**Never claim completion if verification fails.**

## Related Skills

| When | Use |
|------|-----|
| Tests failing | `/systematic-debugging` for root cause |
| Build errors | `/android-build` for troubleshooting |
| Before commit/PR | `/reviewing-code` for quality check |
| String verification | `/localizing-android` for audit commands |

**Upstream pattern:** Adapted from [superpowers/verification-before-completion](https://github.com/obra/superpowers)
