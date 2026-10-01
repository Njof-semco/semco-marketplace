# Java, Kotlin

Inline: `//`. Doc comments: `/** ... */` (Javadoc, KDoc) on one line when it fits.

## Doc comment (only when the contract is not obvious)

```java
/** Returns Optional.empty() for archived customers, even if the id exists. */
public Optional<Customer> findActiveCustomer(long customerId)
```

```kotlin
/** Blocks until the lock is free, call it off the main thread. */
fun acquireExportLock(exportId: String): ExportLock
```

No doc comment needed:

```kotlin
fun totalWeight(items: List<Item>): Double
```

## Inline comment

```java
// ConcurrentHashMap: listeners register from the event thread while the scheduler reads
private final Map<String, Listener> listeners = new ConcurrentHashMap<>();
```

## Bad to good

```java
// Bad
/**
 * Sets the name.
 * @param name the name
 */
public void setName(String name)

// Good: no comment on a plain setter
public void setName(String name)
```
