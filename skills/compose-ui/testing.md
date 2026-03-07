# Compose UI Testing

## Semantic Matchers

```kotlin
@Test
fun testButtonHasCorrectLabel() {
    composeTestRule.setContent {
        MyButton()
    }

    // Find by content description
    composeTestRule
        .onNodeWithContentDescription("Submit form")
        .assertIsDisplayed()
        .performClick()

    // Find by text
    composeTestRule
        .onNodeWithText("Submit")
        .assertExists()

    // Find by test tag
    composeTestRule
        .onNodeWithTag("submit_button")
        .assertIsEnabled()
}
```

## Common Assertions

```kotlin
// Visibility
.assertIsDisplayed()
.assertIsNotDisplayed()
.assertExists()
.assertDoesNotExist()

// State
.assertIsEnabled()
.assertIsNotEnabled()
.assertIsSelected()
.assertIsOn()  // For toggles
.assertIsOff()

// Content
.assertTextEquals("Expected text")
.assertContentDescriptionEquals("Description")
```

## Testing State Changes

```kotlin
@Test
fun testToggleState() {
    composeTestRule.setContent {
        var checked by remember { mutableStateOf(false) }
        Checkbox(
            checked = checked,
            onCheckedChange = { checked = it }
        )
    }

    // Initial state
    composeTestRule
        .onNodeWithRole(Role.Checkbox)
        .assertIsOff()

    // Toggle
    composeTestRule
        .onNodeWithRole(Role.Checkbox)
        .performClick()

    // Verify change
    composeTestRule
        .onNodeWithRole(Role.Checkbox)
        .assertIsOn()
}
```

## Testing Accessibility

```kotlin
@Test
fun testAccessibilityLabels() {
    composeTestRule.setContent {
        TaskCard(task = testTask)
    }

    // Verify content description exists
    composeTestRule
        .onNodeWithContentDescription("Task card for ${testTask.title}")
        .assertExists()

    // Verify role
    composeTestRule
        .onNode(hasRole(Role.Button))
        .assertExists()
}
```

## Waiting for Async Content

```kotlin
@Test
fun testAsyncContent() {
    composeTestRule.setContent {
        AsyncComponent()
    }

    // Wait for content to appear
    composeTestRule.waitUntil(timeoutMillis = 5000) {
        composeTestRule
            .onAllNodesWithText("Loaded")
            .fetchSemanticsNodes()
            .isNotEmpty()
    }

    composeTestRule
        .onNodeWithText("Loaded")
        .assertIsDisplayed()
}
```

## Test Tags

Add test tags for complex components:

```kotlin
// In production code
Modifier.testTag("task_list")

// In test
composeTestRule
    .onNodeWithTag("task_list")
    .onChildren()
    .assertCountEquals(3)
```

## Screenshot Testing

```kotlin
@Test
fun testComponentSnapshot() {
    composeTestRule.setContent {
        MyComponent()
    }

    composeTestRule
        .onRoot()
        .captureToImage()
        .assertAgainstGolden(goldenIdentifier = "my_component")
}
```
