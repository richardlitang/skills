---
name: localizing-android
description: Manages Android string resources and translations. Use when adding UI strings, creating translations, auditing localization, or when code contains hardcoded text. Covers string resource workflow, Str.kt patterns, and translation guidelines for 7 languages.
user-invocable: true
---

# Android Localization Skill

## Quick Start

When adding UI text, follow this workflow:

1. Add string to `res/values/strings.xml` (Sentence case for buttons)
2. Add composable function to `core/localization/Str.kt`
3. Add translations to ALL 7 language files
4. Use `Str.*()` in composables or `context.getString()` in ViewModels/Services

## Key Files

| File | Purpose |
|------|---------|
| `core/localization/Str.kt` | Type-safe string wrappers |
| `core/localization/LanguageManager.kt` | Runtime language switching |
| `res/values/strings.xml` | English (default) |
| `res/values-{lang}/strings.xml` | Translations (es, de, fr, pt, ja, hi, tl) |

## Usage Patterns

```kotlin
// In Composables - use Str.*
Text(text = Str.Cockpit.focusing())
Text(text = Str.Common.save())

// In Services/Workers/ViewModels - use context.getString()
context.getString(R.string.notification_title)
showHudAlert(context.getString(R.string.task_added))
```

## Adding New Strings

### Step 1: Add to strings.xml

```xml
<string name="my_new_feature">Feature description</string>
```

**Casing rules:**
- Buttons: Sentence case ("Save changes", NOT "Save Changes")
- Headings: Title case OK
- System messages: Context-appropriate

### Step 2: Add to Str.kt

```kotlin
object MyFeature {
    @Composable @ReadOnlyComposable
    fun myNewString() = stringResource(R.string.my_new_feature)
}
```

### Step 3: Add Translations

**CRITICAL**: Add to ALL 7 files. See [translation-philosophy.md](translation-philosophy.md) for language-specific rules.

## Composable Context Requirement

Strings MUST be accessed within composable context to react to language changes:

```kotlin
// WRONG - won't update on language change
sealed class Destination(val label: String)

// CORRECT - updates dynamically
sealed class Destination {
    @Composable
    fun localizedLabel(): String = when (this) {
        is Focus -> Str.Nav.tabFocus()
        is Tasks -> Str.Nav.tabTasks()
    }
}
```

## Audit Checklist

Before committing UI code, run these checks. See [audit-commands.md](audit-commands.md) for full commands.

**Quick checks:**
1. No hardcoded alert messages: `showHudAlert("...")`
2. No hardcoded Text content: `Text(text = "...")`
3. No hardcoded button labels: `label = "..."`
4. String counts match across all language files

## Common Anti-Patterns

| Anti-Pattern | Solution |
|--------------|----------|
| `showHudAlert("Task added")` | `showHudAlert(context.getString(R.string.task_added))` |
| `Text(text = "Save")` | `Text(text = Str.Common.save())` |
| `val label = "Delete"` | `@Composable fun label() = Str.Common.delete()` |
| Messages in sealed class data | Move localization to call site |

## Translation Guidelines Summary

| Language | Code-Switching? | English Terms |
|----------|-----------------|---------------|
| Filipino (tl) | YES | Keep tech terms in English |
| Hindi (hi) | YES (Hinglish) | Keep transliterated |
| Japanese (ja) | NO | Use Katakana (タスク, ストリーク) |
| French (fr) | HARD NO | Translate everything |
| Spanish (es) | NO | Translate everything |
| German (de) | MAYBE | Usually translate |
| Portuguese (pt) | SOMETIMES | Translate actions, keep brands |

**For detailed rules**: See [translation-philosophy.md](translation-philosophy.md)

## String Cleanup

When removing features:
1. Delete strings from ALL 8 files (values + 7 language variants)
2. Remove unused Str.kt functions
3. Verify no orphaned references with grep

## Related Skills

| When | Use |
|------|-----|
| Building UI | `/compose-ui` for accessibility |
| Before commit | `/verifying-completion` with string count check |
| Code review | `/reviewing-code` includes localization audit |

**7 languages required:** es, de, fr, pt, ja, hi, tl
