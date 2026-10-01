# Bad Examples

Failure modes to avoid. Each one shows the bad version and the fix.

## Leaked conversation or change history

The reader sees the code, not the chat or the diff. A comment that talks about what changed, what was asked, or what the old version did means nothing to them and goes stale immediately.

```csharp
// Bad: describes the edit, not the code
// Now uses the async version instead of the old sync call
await _repository.SaveAsync(order);

// Good: no comment, the code is clear
await _repository.SaveAsync(order);
```

```typescript
// Bad: repeats the chat
// As discussed, we filter out archived vessels here
const activeVessels = vessels.filter(vessel => !vessel.isArchived);

// Good: no comment, the filter says it
const activeVessels = vessels.filter(vessel => !vessel.isArchived);
```

```csharp
// Bad: tells the bug story
// Fixed the bug where the total was wrong because discounts were applied twice
var total = lines.Sum(line => line.NetPrice);

// Good: only if the trap is real, say what is true now
// NetPrice already includes the discount, do not apply it again
var total = lines.Sum(line => line.NetPrice);
```

```python
# Bad: a note to the user, not to the reader
# NOTE: changed timeout to 30 per your request
TIMEOUT_SECONDS = 30

# Good: the reason, if there is one
# The IFS export endpoint can take up to 20 s on month-end
TIMEOUT_SECONDS = 30
```

## Oversized doc comment

A doc block that lists every parameter and return value repeats the signature.

```csharp
// Bad
/// <summary>
/// This method calculates the shipping cost for the given order.
/// It takes the weight and the destination into account and
/// returns the calculated cost.
/// </summary>
/// <param name="order">The order to calculate shipping for.</param>
/// <returns>The shipping cost.</returns>
public decimal CalculateShippingCost(Order order)

// Good: only the part the signature does not tell
/// <summary>Returns 0 for destinations we do not ship to, call CanShipTo first.</summary>
public decimal CalculateShippingCost(Order order)
```

## Too many small comments

A comment between every field turns a short interface into a wall of prose.
One comment above the type carries the same information and reads in one pass.

```typescript
// Bad
export interface TaskActionResult {
    succeeded: string[];
    // Rows rejected before sending because an untouched field changed since
    // the list was loaded (someone else updated the part). Submitting would
    // overwrite their change with a stale value.
    conflicts: Array<{ id: string; error: string }>;
    // Rows rejected before sending because a required field is empty.
    invalid: Array<{ id: string; error: string }>;
    // The update applied, but IFS reported these sub-parts do not exist, so
    // they must be created. Carries the fetched full part for pre-filling.
    missing: MissingSubPartTarget[];
}

// Good
// Per-row outcome keyed by table row id. Rows are bucketed by why they did not go through.
export interface TaskActionResult {
    succeeded: string[];
    conflicts: Array<{ id: string; error: string }>;
    invalid: Array<{ id: string; error: string }>;
    missing: MissingSubPartTarget[];
}
```

## Restating the code

If the comment reads like the line under it said out loud, delete it.

```typescript
// Bad
// Set loading to true
setLoading(true);
```

## Two ideas in one long comment

```typescript
// Bad
// False until the saved filters have been read from localStorage. The fetch effects wait for it, otherwise every load would run its procs once with the defaults and again with the restored filters.
hasHydrated: boolean;

// Good
// False until saved filters are read, the effects wait so a load does not fetch twice
hasHydrated: boolean;
```
