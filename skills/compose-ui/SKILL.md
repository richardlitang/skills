---
name: compose-ui
description: Jetpack Compose patterns, Material 3 components, and accessibility. Use when building UI components, adding contentDescription, implementing semantics, handling state, or creating responsive layouts.
user-invocable: true
---

# Compose UI Skill

## Accessibility (REQUIRED)

**All interactive elements MUST have accessibility labels.**

### Icons and Images

```kotlin
// ALWAYS provide contentDescription
Icon(
    imageVector = Icons.Default.Delete,
    contentDescription = stringResource(R.string.delete_task)
)

// Decorative-only icons (rare)
Icon(
    imageVector = Icons.Default.Star,
    contentDescription = null  // Only if truly decorative
)
```

### Custom Semantics

```kotlin
// Add semantics for complex components
Box(
    modifier = Modifier.semantics {
        contentDescription = "Task card for ${task.title}"
        role = Role.Button
    }
)

// Clear inherited semantics and set new ones
Row(
    modifier = Modifier.clearAndSetSemantics {
        contentDescription = "Completed task: ${task.title}"
        stateDescription = if (task.isComplete) "Checked" else "Unchecked"
    }
)
```

### Clickable Elements

```kotlin
// Buttons with clear labels
Button(
    onClick = { /* action */ },
    modifier = Modifier.semantics {
        contentDescription = "Submit form"
    }
) {
    Text("Submit")
}
```

## State Management Patterns

### Local UI State

```kotlin
@Composable
fun MyComponent() {
    var isExpanded by remember { mutableStateOf(false) }
    var text by remember { mutableStateOf("") }

    // Use state...
}
```

### Side Effects

```kotlin
// One-time effects
LaunchedEffect(key1) {
    // Runs when key1 changes
}

// Lifecycle-aware cleanup
DisposableEffect(key1) {
    // Setup
    onDispose {
        // Cleanup
    }
}

// Derived state (avoid recomposition)
val sortedList by remember(items) {
    derivedStateOf { items.sortedBy { it.name } }
}
```

## Material 3 Color Contrast

```kotlin
// CORRECT - Accessible contrast
Button(
    colors = ButtonDefaults.buttonColors(
        containerColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onPrimary
    )
)

// WRONG - Poor contrast
Button(
    colors = ButtonDefaults.buttonColors(
        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
        contentColor = MaterialTheme.colorScheme.primaryContainer  // Bad!
    )
)
```

## Adaptive Layouts

### Navigation Type

```kotlin
val navigationType = getNavigationType()

when (navigationType) {
    NavigationType.BOTTOM_NAVIGATION -> // Phone layout
    NavigationType.NAVIGATION_RAIL -> // Tablet layout
}
```

### Responsive Padding

```kotlin
Modifier.adaptiveHorizontalPadding()

// Or with content constraints
AdaptiveContentContainer {
    // Content constrained to max width
}
```

## Common Patterns

### FAB with Icon

```kotlin
ExtendedFloatingActionButton(
    onClick = { /* action */ }
) {
    Icon(
        imageVector = Icons.Default.Add,
        contentDescription = stringResource(R.string.add_task)
    )
    Text(text = stringResource(R.string.add_entry))
}
```

### Cards with Click

```kotlin
Card(
    modifier = Modifier
        .clickable(onClick = onClick)
        .semantics {
            role = Role.Button
            contentDescription = "Open ${item.title}"
        }
) {
    // Content
}
```

## Vector Design System

Use theme tokens consistently:

```kotlin
// Spacing
Modifier.padding(DesignSystem.Spacing.md)

// Colors
MaterialTheme.colorScheme.surface
MaterialTheme.colorScheme.onSurface

// Typography
MaterialTheme.typography.bodyLarge
```

## Anti-Patterns

| Don't | Do |
|-------|-----|
| `Icon(contentDescription = null)` on interactive elements | Always provide description |
| Hardcoded colors | Use `MaterialTheme.colorScheme.*` |
| Hardcoded padding values | Use `DesignSystem.Spacing.*` |
| `mutableStateOf` outside remember | Wrap with `remember` |
| Side effects in composition | Use `LaunchedEffect` |

## Testing Compose UI

See [testing.md](testing.md) for Compose testing patterns and semantic matchers.

## Related Skills

| When | Use |
|------|-----|
| Adding UI strings | `/localizing-android` for translations |
| Writing UI tests | `/tdd-android` for test-first approach |
| Before claiming done | `/verifying-completion` for evidence |
| Designing new UI | `/brainstorming` for requirements |

**Accessibility is non-negotiable.** Every interactive element needs `contentDescription`.
