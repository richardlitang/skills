# Library Debugging with Context7

## When to Use Context7

Use Context7 MCP tool for:
- **Library-specific issues**: Audio playback problems, Compose rendering issues, Hilt injection failures
- **API usage questions**: "What's the correct wake mode for ExoPlayer with local files?"
- **Best practices**: "How should I handle background audio in Media3?"
- **Version-specific behavior**: Check if behavior changed in library updates
- **Performance optimization**: Find recommended approaches from library maintainers

## How to Use Context7

### Step 1: Resolve Library ID

```
mcp__context7__resolve-library-id
- query: "Android Media3 ExoPlayer background playback"
- libraryName: "androidx.media3"
```

### Step 2: Query Documentation

```
mcp__context7__query-docs
- libraryId: "/androidx/media" (from step 1)
- query: "How to prevent Doze mode from pausing ExoPlayer? Wake lock configuration"
```

## Common Library IDs

| Library | Context7 ID |
|---------|-------------|
| Media3/ExoPlayer | `/androidx/media` |
| Jetpack Compose | `/websites/developer_android_develop_ui_compose` |
| Compose Design Systems | `/websites/developer_android_develop_ui_compose_designsystems` |
| Compose Performance | `/websites/developer_android_develop_ui_compose_performance` |
| Hilt/Dagger | `/google/dagger` |
| Kotlin Coroutines | `/kotlinx/coroutines` |
| WorkManager | `/androidx/work` |
| Android Guide | `/websites/developer_android_guide` |

## Example: Audio Shield Issue

**Problem**: Brown noise stops playing when screen turns off

**Without Context7** ❌:
Trial-and-error with wake locks, audio focus, different players → many failed builds

**With Context7** ✅:
```kotlin
// Query: "ExoPlayer wake mode for local files vs network streaming"
// Result: Use WAKE_MODE_LOCAL for local files, not WAKE_MODE_NETWORK
setWakeMode(C.WAKE_MODE_LOCAL) // One-line fix from official docs
```

## Tips

- Be specific in queries - include error symptoms, not just feature names
- Check Context7 **before** refactoring complex code
- Use it to validate assumptions about library behavior
- Great for finding deprecated API replacements
- Include version info if relevant to the issue
