# Testing Anti-Patterns

## Mock Behavior Instead of Real Behavior

### Anti-Pattern

```kotlin
// BAD: Testing mock behavior
@Test
fun `save task calls repository`() {
    val mockRepo = mockk<TaskRepository>()
    every { mockRepo.save(any()) } returns Result.success(task)

    useCase.invoke(task)

    verify { mockRepo.save(task) }  // Only verifies call happened
}
```

### Better

```kotlin
// GOOD: Testing real behavior
@Test
fun `save task persists to database`() {
    val fakeRepo = FakeTaskRepository()
    val useCase = AddTaskUseCase(fakeRepo)

    useCase.invoke(task)

    assertThat(fakeRepo.savedTasks).contains(task)  // Verifies actual effect
}
```

## Test-Only Methods in Production Code

### Anti-Pattern

```kotlin
// BAD: Method exists only for testing
class TaskManager {
    // Only used in tests
    fun getInternalState(): InternalState = internalState

    // Only used in tests
    fun setTestMode(enabled: Boolean) { ... }
}
```

### Better

```kotlin
// GOOD: Test through public API
class TaskManager {
    fun addTask(task: Task): Result<Task>
    fun getTasks(): List<Task>
}

// Test the observable behavior
@Test
fun `addTask increases task count`() {
    val initialCount = manager.getTasks().size
    manager.addTask(task)
    assertThat(manager.getTasks().size).isEqualTo(initialCount + 1)
}
```

## Unmotivated Mocking

### Anti-Pattern

```kotlin
// BAD: Mocking for no reason
@Test
fun `format date returns correct string`() {
    val mockClock = mockk<Clock>()
    every { mockClock.now() } returns fixedTime

    val result = formatter.format(mockClock.now())

    assertThat(result).isEqualTo("Jan 1, 2025")
}
```

### Better

```kotlin
// GOOD: No mock needed
@Test
fun `format date returns correct string`() {
    val date = LocalDate.of(2025, 1, 1)

    val result = formatter.format(date)

    assertThat(result).isEqualTo("Jan 1, 2025")
}
```

## When Mocking IS Appropriate

| Situation | Mock OK? | Better Alternative |
|-----------|----------|-------------------|
| Network calls | ✅ Yes | Fake HTTP client |
| Database | ⚠️ Maybe | In-memory database |
| Time/Clock | ✅ Yes | Inject Clock interface |
| File system | ⚠️ Maybe | Temp directory |
| External API | ✅ Yes | Fake implementation |
| Own classes | ❌ No | Use real implementation |

## Testing Implementation Details

### Anti-Pattern

```kotlin
// BAD: Testing internal implementation
@Test
fun `viewModel uses combine for flows`() {
    // Testing HOW it works, not WHAT it does
}

@Test
fun `repository uses room dao`() {
    verify { dao.insert(any()) }  // Implementation detail
}
```

### Better

```kotlin
// GOOD: Testing behavior
@Test
fun `viewModel emits updated state when task added`() {
    viewModel.addTask(task)

    assertThat(viewModel.uiState.value.tasks).contains(task)
}

@Test
fun `repository persists task across restarts`() {
    repository.save(task)
    val newRepository = createNewRepository()  // Simulate restart

    assertThat(newRepository.getAll()).contains(task)
}
```

## Fragile Tests

### Anti-Pattern

```kotlin
// BAD: Depends on exact order
@Test
fun `tasks returned in order`() {
    assertThat(tasks[0].title).isEqualTo("First")
    assertThat(tasks[1].title).isEqualTo("Second")
}
```

### Better

```kotlin
// GOOD: Tests meaningful behavior
@Test
fun `tasks sorted by due date`() {
    val tasks = repository.getTasksSortedByDueDate()

    assertThat(tasks).isSortedAccordingTo(compareBy { it.dueDate })
}
```

## Test Setup That Hides Intent

### Anti-Pattern

```kotlin
// BAD: Setup hides what's being tested
@Before
fun setup() {
    task1 = Task(id = 1, title = "Task 1", priority = HIGH, ...)
    task2 = Task(id = 2, title = "Task 2", priority = LOW, ...)
    task3 = Task(id = 3, title = "Task 3", priority = MEDIUM, ...)
    // ... 20 more lines of setup
}

@Test
fun `high priority tasks first`() {
    val result = sorter.sort(listOf(task1, task2, task3))
    // What makes task1 special? Have to look at setup
}
```

### Better

```kotlin
// GOOD: Setup in test shows intent
@Test
fun `high priority tasks first`() {
    val highPriority = Task(title = "High", priority = HIGH)
    val lowPriority = Task(title = "Low", priority = LOW)

    val result = sorter.sort(listOf(lowPriority, highPriority))

    assertThat(result.first()).isEqualTo(highPriority)
}
```

## Ignoring Edge Cases

### Must Test

| Category | Examples |
|----------|----------|
| Empty inputs | Empty list, blank string, null |
| Boundary values | 0, 1, MAX_INT, empty collection |
| Error conditions | Network failure, invalid data |
| Concurrent access | Race conditions, thread safety |
| State transitions | Valid and invalid transitions |
