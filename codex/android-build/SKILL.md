---
name: android-build
description: Android build process optimization and troubleshooting. Use when building APKs, verifying code compiles, handling Gradle errors, or coordinating builds across multiple Claude instances.
user-invocable: true
allowed-tools: Bash(./gradlew *), Bash(./quick-check.sh)
---

# Android Build Skill

## Quick Reference

| Task | Command | Speed |
|------|---------|-------|
| Quick check (compilation only) | `./quick-check.sh` | Fast (~70% faster) |
| Full debug build | `./gradlew assembleDebug` | Standard |
| Run unit tests | `./gradlew testDebugUnitTest` | Varies |
| Clean build | `./gradlew clean assembleDebug` | Slow |

## Fast Compilation Check (Recommended)

```bash
./quick-check.sh
```

**Use this when**:
- Verifying code changes compile
- Working with multiple Claude instances
- Need quick feedback on syntax errors
- Don't need APK output

**Skips**: Lint, tests, APK assembly

## Build Workflow

### Standard Verification Flow

```bash
# 1. Quick check during development
./quick-check.sh

# 2. Full build before commit
./gradlew assembleDebug

# 3. Run tests
./gradlew testDebugUnitTest
```

### When Build Fails

1. **Read the error carefully** - Gradle errors often point to the exact issue
2. **Check if it's related to your changes** - Unrelated errors may indicate ongoing work elsewhere
3. **Ask user if unsure** - "Build failed with errors unrelated to my changes. Should I proceed?"
4. **For library-specific errors** - Use Context7 MCP to check official docs BEFORE trial-and-error

See [troubleshooting.md](troubleshooting.md) for common error patterns.

## Multiple Claude Instances

If multiple Claude Code instances are building simultaneously:

| Instance | Recommendation | Why |
|----------|----------------|-----|
| First | `./gradlew assembleDebug` | Full build OK |
| Others | `./quick-check.sh` | Reduces Gradle daemon contention |

## Build Optimizations (Already Enabled)

The project has these in `gradle.properties`:

```properties
org.gradle.parallel=true              # Parallel module builds
org.gradle.caching=true               # Reuses previous outputs
org.gradle.configuration-cache=true   # Faster configuration
org.gradle.jvmargs=-Xmx4096m          # 4GB heap
```

Don't modify these without user approval.

## Library-Specific Issues

Before attempting fixes for Media3/ExoPlayer, Compose rendering, Hilt injection, or Coroutine errors:

**Use Context7 MCP** to check official documentation first. See [library-debugging.md](library-debugging.md).

## Pre-Commit Checklist

```bash
./gradlew assembleDebug && ./gradlew testDebugUnitTest
```

## When NOT to Build

Don't run builds when:
- Only reading code
- Exploring codebase structure
- During planning phase
- User explicitly says "don't build yet"

## Related Skills

| When | Use |
|------|-----|
| Build fails with code error | `/systematic-debugging` for root cause |
| Verifying build before commit | `/verifying-completion` for evidence |
| Library-specific errors | Context7 MCP (see [library-debugging.md](library-debugging.md)) |

**Quick check:** `./quick-check.sh` (~70% faster than full build)
