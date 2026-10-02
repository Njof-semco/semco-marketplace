---
name: code-comments
description: Write clear, plain-spoken code comments and documentation that lives alongside the code. Use when writing or reviewing code that needs inline documentation—file headers, function docs, architectural decisions, or explanatory comments. Optimized for both human readers and AI coding assistants who benefit from co-located context.
---

# Code Comments

Write documentation that lives with the code it describes. Plain language. No jargon. Explain the *why*, not the *what*.

## Core Philosophy

**Co-location wins.** Documentation in separate files drifts out of sync. Comments next to code stay accurate because they're updated together.

**Write for three audiences:**
1. Future you, six months from now
2. Teammates reading unfamiliar code
3. AI assistants (Claude, Copilot) who see one file at a time

**The "why" test:** Before writing a comment, ask: "Does this explain *why* this code exists or *why* it works this way?" If it only restates *what* the code does, skip it.

**Short and sweet.** Comments should be concise, but not cryptic. Use plain language, not clever wordplay and keep a comment at MAX 2 lines and less if possible for a clearer and faster reading experience.

```typescript
// Bad. Two ideas and a paragraph of prose, for one boolean.
// False until the saved filters have been read from localStorage. The fetch effects wait for it, otherwise every load would run its procs once with the defaults and again with the restored filters.
hasHydrated: boolean;

// Good. One idea, said once.
// False until the saved filters are read; the effects wait so a load does not fetch twice.
hasHydrated: boolean;
```

**Do not comment every member of a type.** Inline notes are fine, and one or
two fields usually earn one: the field with a trap, a unit, or a value that is
not what it looks like. What does not work is a note on every field, each two
lines long. The reader stops seven times for what one block above the type
would have said once. Summarize the shape at the top, then keep the inline note
only where a member would genuinely surprise someone. Worked example in
[references/Bad-examples.md](references/Bad-examples.md).

Name each field in backticks in that summary. It costs two characters and tells
the reader a field name apart from an ordinary word, which matters when fields
are called things like `missing` or `partial`. TSDoc's `{@link Type.field}` is
the alternative and it is clickable on hover, but at roughly 30 characters a
reference it undoes the shortening you just did, so save it for the rare
cross-reference to another file.

```typescript
/**
 * Rows are bucketed by what happened: `conflicts` was rejected before sending,
 * `missing` needs its sub-parts created.
 */
export interface TaskActionResult {
    conflicts: Array<{ id: string; error: string }>;
    missing: MissingSubPartTarget[];
}
```

## Documentation Levels

### File Headers

None, this was removed, so ignore part of the language examples that include this

### Function & Method Documentation

Document the contract, not the implementation.

```typescript
/**
 * Calculates shipping cost with tiered pricing: flat rate under 1lb, regional rates 1-5lb, freight over 5lb.
 * Returns $0 for destinations we do not ship to instead of throwing, so call canShipTo() first if that matters.
 */
function calculateShipping(weightLbs: number, zipCode: string): number
```

```python
def sync_user_preferences(user_id: str, prefs: dict) -> SyncResult:
    """
    Pushes local preference changes to the server and pulls remote changes.

    Conflict resolution: server wins for security settings, local wins
    for UI preferences. See PREFERENCES.md for the full conflict matrix.

    Called automatically on app foreground. Can also be triggered manually
    from Settings > Sync Now.
    """
```

**Include:**
- What the function accomplishes (not how)
- Non-obvious parameter constraints or edge cases
- What the return value means, especially for ambiguous cases
- Side effects (network calls, file writes, state mutations)

**Skip for:** Simple getters, obvious one-liners, private helpers with descriptive names.

### Inline Comments

Use sparingly. When you need them, explain the reasoning.

In bigger methods, making comments as steps 1), 2), 3) will help readers follow the flow.

```typescript
// Debounce search by 300ms to avoid hammering the API on every keystroke.
// 300ms feels responsive while cutting API calls by ~80% in user testing.
const debouncedSearch = useMemo(
  () => debounce(executeSearch, 300),
  [executeSearch]
);
```

```swift
// Force unwrap is safe here—viewDidLoad guarantees the storyboard
// connected this outlet. If it's nil, we want to crash immediately rather than fail silently later.
let tableView = tableView!
```

```python
# Process oldest items first. Newer items are more likely to be
# modified again, so processing them last reduces wasted work.
queue.sort(key=lambda x: x.created_at)
```

### Architectural Comments

None, this was removed, so ignore part of the language examples that include this

### TODO Comments

Make them actionable and traceable.

```typescript
// TODO(pete): Extract to shared util once mobile team needs this too.
// Blocked on: Mobile API parity (see MOBILE-123)

// HACK: Workaround for Safari flexbox bug. Remove after dropping Safari 14.
// Bug report: https://bugs.webkit.org/show_bug.cgi?id=XXXXX

// FIXME: Race condition when user rapidly toggles. Need to cancel
// in-flight requests. Reproduced in issue #892.
```

## Language-Specific Patterns

See [references/language-examples.md](references/language-examples.md) for detailed examples in:
- TypeScript/JavaScript (JSDoc, TSDoc patterns)
- Swift (documentation comments, MARK pragmas)
- Python (docstrings, type hint documentation)
- React/Next.js (component documentation patterns)

See [references/Bad-examples.md](references/Bad-examples.md) for the failure
modes to avoid.

## Writing Style

**Plain language.** Write like you're explaining to a smart colleague who doesn't have context.

**Active voice.** "This function validates..." not "Validation is performed..."

**Be specific.** "Retries 3 times with 1s backoff" not "Handles retries."

**Skip the obvious.** If the code says `user.isAdmin`, don't comment "checks if user is admin."

**Date things that expire.** Workarounds, version-specific code, and temporary solutions should note when they can be removed.

**Reference constants, don't duplicate values.** When a behavior is controlled by a constant, reference it by name—don't restate its value in the comment.

```rust
// Bad: duplicates the value, will drift when constant changes
/// Returns true if stale (not updated in last 5 minutes)
pub fn is_stale(&self) -> bool { ... }

// Good: references the constant
/// Returns true if stale (not updated within [`STALE_THRESHOLD_SECS`])
pub fn is_stale(&self) -> bool { ... }
```

Unit translations for magic numbers are fine (`1048576 // 1MB`) since they add clarity, not duplication.