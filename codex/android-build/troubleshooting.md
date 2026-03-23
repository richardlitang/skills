# Build Troubleshooting Guide

## Common Error Patterns

### 1. Unresolved Reference Errors

**Symptom**: `Unresolved reference: SomeClass`

**Causes**: Missing import, class doesn't exist, wrong package, Hilt dependency not injected

**Fix**:
1. Check if class exists: `find . -name "*SomeClass*.kt"`
2. Verify imports match package structure
3. For Hilt classes, verify `@Inject` and `@HiltViewModel` annotations
4. Run `./gradlew clean` if class was recently added

---

### 2. Duplicate Class Errors

**Symptom**: `Duplicate class found in modules`

**Fix**:
```bash
./gradlew :app:dependencies > deps.txt
grep "ConflictingLibrary" deps.txt
```

---

### 3. Compilation Failed (Generic)

**Symptom**: Build fails with generic "Compilation failed"

**Fix**:
```bash
./gradlew clean
./gradlew --stop
./gradlew assembleDebug
```

---

### 4. Manifest Merge Errors

**Symptom**: `Manifest merger failed`

**Fix**: Check `AndroidManifest.xml` for conflicts, use `tools:replace` if needed:
```xml
<uses-permission android:name="..." tools:node="replace" />
```

---

### 5. R Class Not Found

**Symptom**: `Unresolved reference: R`

**Causes**: XML resource errors, invalid resource names

**Fix**: Check recent XML changes for syntax errors, validate resource names (lowercase, underscores only)

---

## Context7 Integration

**When you see library-specific errors, don't guess - check docs first:**

```
1. mcp__context7__resolve-library-id
   - libraryName: "androidx.media3"
   - query: "Your specific error"

2. mcp__context7__query-docs
   - libraryId: From step 1
   - query: Specific problem with error context
```

**Example**: "ExoPlayer pauses when screen turns off"
- Query Context7 for "ExoPlayer wake lock local file playback"
- Result: Use `WAKE_MODE_LOCAL` not `WAKE_MODE_NETWORK`

---

## When to Ask for Help

Ask the user if:
1. Error is unrelated to your recent changes
2. Build requires credentials or API keys
3. Error suggests ongoing work elsewhere
4. You need to modify build configuration
5. Error persists after Context7 research
