# Localization Audit Commands

Run these commands before committing any UI changes to catch untranslated strings.

## 1. Check for Hardcoded Alert Messages

```bash
grep -n 'showHudAlert("' app/src/main/java/com/thebabacorp/vector/**/*.kt
```

**Expected**: 0 results

**Why**: All alerts must use `context.getString(R.string.*)`

**Fix**:
```kotlin
// BAD
showHudAlert("Task added")

// GOOD
showHudAlert(context.getString(R.string.task_added))
```

---

## 2. Check for Hardcoded Text() Content

```bash
grep -rn 'Text(\s*$' app/src/main/java/com/thebabacorp/vector/**/*.kt
grep -rn 'text = "[A-Z]' app/src/main/java/com/thebabacorp/vector/**/*.kt
```

**Expected**: Minimal results (some dynamic content acceptable)

**Why**: Text composables should use `Str.*()` functions

**Fix**:
```kotlin
// BAD
Text(text = "Save changes")

// GOOD
Text(text = Str.Common.saveChanges())
```

---

## 3. Check for Hardcoded Button Labels

```bash
grep -rn 'label = "[A-Z]' app/src/main/java/com/thebabacorp/vector/**/*.kt
```

**Expected**: 0 results

**Why**: All button labels must use `Str.*()` functions

**Fix**:
```kotlin
// BAD
VectorButton(label = "Delete task")

// GOOD
VectorButton(label = Str.Tasks.deleteTask())
```

---

## 4. Verify String Count Across Languages

```bash
# Count strings in each file
echo "English:    $(grep '<string name=' app/src/main/res/values/strings.xml | wc -l)"
echo "Spanish:    $(grep '<string name=' app/src/main/res/values-es/strings.xml | wc -l)"
echo "German:     $(grep '<string name=' app/src/main/res/values-de/strings.xml | wc -l)"
echo "French:     $(grep '<string name=' app/src/main/res/values-fr/strings.xml | wc -l)"
echo "Portuguese: $(grep '<string name=' app/src/main/res/values-pt/strings.xml | wc -l)"
echo "Japanese:   $(grep '<string name=' app/src/main/res/values-ja/strings.xml | wc -l)"
echo "Hindi:      $(grep '<string name=' app/src/main/res/values-hi/strings.xml | wc -l)"
echo "Filipino:   $(grep '<string name=' app/src/main/res/values-tl/strings.xml | wc -l)"
```

**Expected**: All counts should match exactly

**Fix**: Find missing strings and add translations

---

## 5. Find Missing Translations (Specific String)

```bash
# Replace "my_new_string" with the string name you're checking
STRING_NAME="my_new_string"

echo "Checking for: $STRING_NAME"
grep -l "name=\"$STRING_NAME\"" app/src/main/res/values*/strings.xml
```

**Expected**: 8 files (values + 7 language variants)

**Fix**: Add the string to missing language files

---

## 6. Check for Validation Result Messages in Data Classes

```bash
grep -rn 'data class.*Result.*message: String' app/src/main/java/com/thebabacorp/vector/**/*.kt
```

**Expected**: 0 results (or very few justified cases)

**Why**: Messages in data classes can't be localized

**Fix**:
```kotlin
// BAD - message can't be localized
sealed class ValidationResult {
    data class Failed(val message: String) : ValidationResult()
}

// GOOD - localize at call site
sealed class ValidationResult {
    object Failed : ValidationResult()
}

// In ViewModel:
when (result) {
    is ValidationResult.Failed -> context.getString(R.string.validation_failed)
}
```

---

## 7. Find Unused Strings (Manual Review Required)

```bash
# Check which strings are actually used
for string in $(grep 'name=' app/src/main/res/values/strings.xml | sed 's/.*name="\([^"]*\)".*/\1/'); do
    count=$(grep -r "R.string.$string\|string.$string" app/src/main/java | wc -l)
    if [ "$count" -eq "0" ]; then
        echo "Unused: $string"
    fi
done
```

**Action**: Review listed strings and delete if truly unused from ALL language files

---

## Common Patterns That Indicate Missing Localization

### Pattern 1: Alert with String Literal
```kotlin
// BAD
showHudAlert("Changes saved successfully")

// GOOD
showHudAlert(context.getString(R.string.changes_saved))
```

### Pattern 2: Text with Hardcoded String
```kotlin
// BAD
Text(text = "No tasks available")

// GOOD
Text(text = Str.Tasks.noTasksAvailable())
```

### Pattern 3: Class-Level Constants
```kotlin
// BAD - won't update on language change
object Constants {
    const val WELCOME_MESSAGE = "Welcome to Vector"
}

// GOOD - updates dynamically
object Str {
    object Onboarding {
        @Composable @ReadOnlyComposable
        fun welcomeMessage() = stringResource(R.string.welcome_message)
    }
}
```

### Pattern 4: String Concatenation
```kotlin
// BAD - hard to translate
Text(text = "You have $count tasks")

// GOOD - use plurals
Text(text = pluralStringResource(R.plurals.task_count, count, count))
```

---

## Pre-Commit Checklist

Run before every commit that touches UI:

```bash
# Quick audit script
echo "=== Localization Audit ==="
echo ""
echo "1. Hardcoded alerts:"
grep -c 'showHudAlert("' app/src/main/java/com/thebabacorp/vector/**/*.kt || echo "✓ None found"
echo ""
echo "2. String counts:"
echo "   EN: $(grep '<string name=' app/src/main/res/values/strings.xml | wc -l)"
echo "   ES: $(grep '<string name=' app/src/main/res/values-es/strings.xml | wc -l)"
echo "   DE: $(grep '<string name=' app/src/main/res/values-de/strings.xml | wc -l)"
echo "   FR: $(grep '<string name=' app/src/main/res/values-fr/strings.xml | wc -l)"
echo "   PT: $(grep '<string name=' app/src/main/res/values-pt/strings.xml | wc -l)"
echo "   JA: $(grep '<string name=' app/src/main/res/values-ja/strings.xml | wc -l)"
echo "   HI: $(grep '<string name=' app/src/main/res/values-hi/strings.xml | wc -l)"
echo "   TL: $(grep '<string name=' app/src/main/res/values-tl/strings.xml | wc -l)"
echo ""
echo "✓ All counts should match"
```
