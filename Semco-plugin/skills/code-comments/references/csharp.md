# C#

Inline: `//`. Doc comments: `/// <summary>` on one line when it fits.

## Doc comment (only when the contract is not obvious)

```csharp
/// <summary>Returns an empty list when the vessel has no open work orders, never null.</summary>
public IReadOnlyList<WorkOrder> GetOpenWorkOrders(int vesselId)
```

One parameter with a trap gets a `<param>`, the rest do not:

```csharp
/// <summary>Books the job and sends the confirmation mail.</summary>
/// <param name="startUtc">Must be UTC, local times are rejected.</param>
public async Task BookJobAsync(int jobId, DateTime startUtc, string technician)
```

No doc comment needed, the name and signature say it all:

```csharp
public decimal CalculateTotalPrice(Order order)
```

## Inline comment

```csharp
// AsNoTracking: the entity is copied and re-attached below, tracking would cause a duplicate key
var part = await _db.Parts.AsNoTracking().FirstAsync(p => p.Id == partId);
```

## Bad to good

```csharp
// Bad
/// <summary>
/// Gets the user by id.
/// </summary>
/// <param name="id">The id.</param>
/// <returns>The user.</returns>
public User GetUser(int id)

// Good: no comment, the signature already says this
public User GetUser(int id)
```
