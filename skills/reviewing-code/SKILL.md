---
name: reviewing-code
description: "Use when reviewing PRs, auditing code quality, or before committing. Two-stage review: spec compliance first, then code quality. Uses severity tiers."
user-invocable: true
disable-model-invocation: true
---

# Code Review

## Two-Stage Review Process

### Stage 1: Spec Compliance (First)

Does the code do what it's supposed to?

- [ ] All requirements implemented
- [ ] No missing edge cases
- [ ] No extra features (YAGNI)
- [ ] Tests cover requirements

### Stage 2: Code Quality (Second)

Is the code well-written?

- [ ] Follows project patterns
- [ ] Readable and maintainable
- [ ] Properly tested
- [ ] No security issues

**Do NOT review quality until spec compliance passes.**

## Severity Tiers

### 🔴 Critical (Must Fix)

Blocks merge. Security issues, broken functionality, data loss risk.

```markdown
🔴 **Critical: SQL Injection Risk**
File: `UserRepository.kt:45`

Issue: User input interpolated directly into query
```kotlin
// Current (vulnerable)
query("SELECT * FROM users WHERE name = '$name'")

// Required
query("SELECT * FROM users WHERE name = ?", arrayOf(name))
```
```

### 🟡 Suggestion (Should Fix)

Improves code quality. Not blocking but recommended.

```markdown
🟡 **Suggestion: Extract to Manager**
File: `CockpitViewModel.kt:120-180`

Issue: Complex calculation logic in ViewModel (60 lines)
Recommendation: Extract to `SpinManager` for testability
```

### 🟢 Nit (Nice to Have)

Minor polish. Naming, formatting, style.

```markdown
🟢 **Nit: Naming**
File: `TaskCard.kt:23`

`val x` → `val taskCount` for clarity
```

### ✅ Positive (Good Pattern)

Recognize good code. Reinforces best practices.

```markdown
✅ **Good: Proper Error Handling**
File: `TaskRepository.kt:34`

Clean use of VectorError framework with specific error types.
```

## Review Checklist

### Security

- [ ] No hardcoded secrets/API keys
- [ ] User input validated
- [ ] No SQL/command injection
- [ ] Sensitive data not logged

### Accessibility

- [ ] All Icons have `contentDescription`
- [ ] All interactive elements labeled
- [ ] Color contrast sufficient

### Localization

- [ ] No hardcoded strings in UI
- [ ] All 7 language files updated
- [ ] String counts match

### Architecture

- [ ] Follows Manager pattern for complex logic
- [ ] Uses Hilt for dependencies
- [ ] Uses VectorError for errors
- [ ] Single responsibility maintained

### Testing

- [ ] New code has tests
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases covered
- [ ] TDD followed (test before code)

### Performance

- [ ] No N+1 queries
- [ ] Large lists use LazyColumn
- [ ] No unnecessary recomposition
- [ ] Heavy work on background thread

## Audit Commands

```bash
# Security: Check for hardcoded secrets
grep -rn "api_key\|password\|secret" app/src/main/java/

# Accessibility: Find Icons without contentDescription
grep -rn "Icon(" app/src/main/java/**/*.kt | grep -v "contentDescription"

# Localization: Check string counts
for f in values values-es values-de values-fr values-pt values-ja values-hi values-tl; do
  echo "$f: $(grep '<string name=' app/src/main/res/$f/strings.xml | wc -l)"
done

# Architecture: Find large ViewModels
wc -l app/src/main/java/**/*ViewModel.kt | sort -n
```

## Review Output Format

```markdown
## Code Review: [PR Title/Branch]

### Summary
[1-2 sentences on overall assessment]

### 🔴 Critical Issues (X)
[List with file, line, issue, fix]

### 🟡 Suggestions (X)
[List with file, line, issue, recommendation]

### 🟢 Nits (X)
[List with file, line, suggestion]

### ✅ Good Patterns Observed
[Positive feedback]

### Verdict
- [ ] Ready to merge
- [ ] Ready after critical fixes
- [ ] Needs significant revision
```

## Red Flags

### Patterns That Trigger Deeper Review:

| Pattern | Concern |
|---------|---------|
| >300 line ViewModel | God class, extract Managers |
| Direct repository in UI | Missing ViewModel layer |
| `viewModelScope.launch` everywhere | Use `combine()` for flows |
| Hardcoded strings in UI | Localization issue |
| `contentDescription = null` on buttons | Accessibility violation |
| No tests for new logic | Missing TDD |

## Before Approving

```bash
# Must all pass:
./gradlew assembleDebug
./gradlew testDebugUnitTest
./gradlew lintDebug
```

**Never approve with failing checks.**

## Related Skills

| When | Use |
|------|-----|
| Verifying claims | `/verifying-completion` for evidence |
| Checking accessibility | `/compose-ui` for patterns |
| Checking localization | `/localizing-android` for audit commands |
| Build verification | `/android-build` for commands |

**Two-stage review:** Spec compliance FIRST, then code quality.
