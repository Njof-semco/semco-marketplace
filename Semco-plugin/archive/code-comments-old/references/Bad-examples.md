# Bad Examples

Failure modes to avoid. Each one shows the bad version and the fix.

## Too many small comments

A comment between every field turns a short interface into a wall of prose.
One comment above the type carries the same information and reads in one pass.

Bad:

```typescript
// Per-row outcome for the task-list actions, keyed by the table row id so the
// tables can report and refresh without knowing backend correlation ids.
// `partial` = the master step applied but a later step failed (IFS
// UpdatedWithErrors), so the fix is not fully done and the user must see why.
export interface TaskActionResult {
    succeeded: string[];
    partial: Array<{ id: string; error: string }>;
    failed: Array<{ id: string; error: string }>;
    // Rows rejected before sending because an untouched field changed since
    // the list was loaded (someone else updated the part). Submitting would
    // overwrite their change with a stale value.
    conflicts: Array<{ id: string; error: string }>;
    // Rows rejected before sending because a required field is empty.
    invalid: Array<{ id: string; error: string }>;
    // The update applied, but IFS reported these sub-parts do not exist, so
    // they must be created. Carries the fetched full part for pre-filling.
    missing: MissingSubPartTarget[];
    // Per-row outcome with the IFS step breakdown, for the results modal and
    // for narrowing a sub-part retry. Populated by updateDashboardParts and
    // createMissingSubParts; the other actions leave it empty.
    outcomes: UpdateRowOutcome[];
}
```

Good:

```typescript
// Per-row outcome for the task-list actions, keyed by table row id. Rows are
// bucketed by why they did not go through, so each modal can show its own.
export interface TaskActionResult {
    succeeded: string[];
    partial: Array<{ id: string; error: string }>;
    failed: Array<{ id: string; error: string }>;
    conflicts: Array<{ id: string; error: string }>;
    invalid: Array<{ id: string; error: string }>;
    missing: MissingSubPartTarget[];
    outcomes: UpdateRowOutcome[];
}
```

## Restating the code

If the comment reads like the line under it said out loud, delete it.

```typescript
// Bad: says nothing the line does not
// Set loading to true
setLoading(true);
```
