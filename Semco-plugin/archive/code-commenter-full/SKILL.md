---
name: code-commenter-full
description: Add comprehensive doc comments AND inline comments to C#, JavaScript, TypeScript, JSX, and TSX code — using XML doc comments for C# and JSDoc for JS/TS. Use this skill when the user wants thorough documentation, phrases like "document this", "add docstrings", "add JSDoc", "add summary comments", "add XML doc comments", "fully comment this", "document my class/component/function", "add comments for the whole team to read", or wants public APIs documented for IntelliSense / IDE tooltips. Trigger this skill whenever the user wants more than just inline notes — when they want every public function, class, or component to carry a description. If the user asks for a lighter touch or "just inline comments", use code-commenter-light instead. Also use to review existing doc comments and fix outdated, vague, or incomplete ones.
---

# Code Commenter (Full)

Add and review comments in C# and JavaScript/TypeScript/React code — including proper doc comments above public APIs. The goal is comments that help a future reader, surface intent in IDE tooltips, and document non-obvious behavior — without devolving into noise.

If the user wants only sparse inline comments and no doc blocks, use `code-commenter-light` instead.

## Core philosophy

Good comments explain **why**, not **what**. The code already shows what it does; comments earn their place by adding context the code can't express on its own: intent, constraints, gotchas, references to specs or tickets, why a non-obvious choice was made.

Default to **moderate density**:
- Doc comments above every public/exported function, class, component, and non-trivial type
- Inline comments only at points where a reader would otherwise pause and ask "wait, why?"
- No comment for code that speaks for itself (`const total = price + tax;` needs nothing)

When in doubt, leave it out. A sparse, accurate comment is worth more than a dense, redundant one.

## Step 1 — Detect the language

Look at the file extension before writing anything:

| Extension | Language | Doc comment style | Inline style |
|---|---|---|---|
| `.cs` | C# | XML doc comments (`/// <summary>`) | `// ...` |
| `.js`, `.jsx` | JavaScript / React | JSDoc (`/** ... */`) | `// ...` |
| `.ts`, `.tsx` | TypeScript / React | JSDoc, but skip `@param` / `@returns` types (TS already has them) | `// ...` |

If a file's extension is ambiguous or missing, look at the syntax — `using System;`, `namespace`, `public class` → C#. `import`, `const`, `=>`, JSX tags → JS/TS.

If the language is something else entirely (Python, Go, Java, etc.), tell the user this skill targets C# and React/JS/TS specifically and ask if they'd like you to proceed anyway using the closest convention.

## Step 2 — Decide what gets a doc comment

Add a doc comment above:

- Every public class, struct, interface, record, enum
- Every public method, function, or exported function
- Every React component (functional or class)
- Every exported constant, hook, or type that isn't self-explanatory
- Non-trivial private helpers whose purpose isn't immediately obvious from the name

Skip:

- Trivial getters/setters or one-line passthroughs
- Auto-generated code
- Test fixtures and obvious test cases (the test name should explain the intent)
- Anonymous inline callbacks

## Step 3 — Decide what gets an inline comment

Add an inline comment where:

- A line does something that looks wrong but is intentional (`// off-by-one is correct here — API uses 1-based indexing`)
- A workaround exists for a known bug, library quirk, or browser issue (link the issue if you know it)
- A magic number or string has meaning that isn't obvious (`// 2592000 = 30 days in seconds`)
- A regex, bitwise op, or dense expression would benefit from a plain-English summary
- A non-obvious side effect or ordering requirement matters (e.g. dispose-before-rethrow)
- A `TODO`, `FIXME`, or `HACK` is genuinely needed

Do NOT add inline comments that:

- Restate the next line in English (`// increment counter` above `counter++`)
- Narrate obvious control flow (`// loop through users`)
- Explain what a well-named variable already explains

## Step 4 — Write the doc comments

### C# (XML doc comments)

Use triple-slash XML comments above the declaration. Always include `<summary>`. Add `<param>`, `<returns>`, `<exception>`, `<remarks>` as needed.

```csharp
/// <summary>
/// Charges the customer's default payment method and returns the resulting transaction.
/// </summary>
/// <param name="customerId">The Stripe customer ID, e.g. "cus_ABC123".</param>
/// <param name="amountCents">Amount to charge in the smallest currency unit.</param>
/// <returns>The completed transaction, or null if the charge was declined.</returns>
/// <exception cref="PaymentProviderException">Thrown when Stripe is unreachable.</exception>
public async Task<Transaction?> ChargeCustomerAsync(string customerId, int amountCents)
```

For classes: one `<summary>` describing the class's responsibility. Don't repeat what individual methods do.

**When the catch is broad (`catch (Exception ex)`) and the method rethrows**, don't fabricate a specific exception type. Document the *behavior* in `<exception>` instead — what gets logged, what gets cleaned up, that the original exception propagates. Example:

```csharp
/// <exception cref="Exception">
/// Any exception during open is logged and rethrown; the partially-constructed
/// connection is disposed first so the caller never receives a leaked handle.
/// </exception>
```

### JavaScript (JSDoc)

Use `/** ... */` blocks. Include `@param` and `@returns` with types.

```javascript
/**
 * Debounce a function so it only fires after `wait` ms of silence.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} wait - Delay in milliseconds.
 * @returns {Function} The debounced wrapper.
 */
function debounce(fn, wait) { ... }
```

### TypeScript (JSDoc, lighter)

TypeScript already encodes types — don't duplicate them in `@param`/`@returns`. Use the doc comment for **purpose and behavior**, not type signatures.

```typescript
/**
 * Debounce a function so it only fires after `wait` ms of silence.
 * Useful for search inputs and resize handlers.
 */
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number): T { ... }
```

Add `@param` only when a parameter needs explanation beyond its name and type.

### React components

Document the component's purpose and any non-obvious props. For TS components, the props interface usually carries the type info, so the comment focuses on behavior.

```tsx
/**
 * Modal dialog with focus trapping and Escape-to-close.
 * Renders into a portal at #modal-root — make sure that element exists.
 */
export function Modal({ isOpen, onClose, children }: ModalProps) { ... }
```

For props interfaces, comment individual props only when the name doesn't make their purpose obvious:

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If true, clicking the backdrop will NOT close the modal. Default: false. */
  disableBackdropClose?: boolean;
  children: React.ReactNode;
}
```

## Step 5 — Reviewing existing comments

When the user asks to review or clean up comments, look for:

1. **Redundant comments** — restate the code. Delete them.
   ```js
   // bad: redundant
   // increment i
   i++;
   ```

2. **Outdated comments** — describe behavior that no longer matches the code. Fix or delete. Outdated comments are worse than no comments because they actively mislead.

3. **Commented-out code** — usually delete. If it really needs to stay, add a one-line note explaining why it's commented and when it can be removed.

4. **Vague comments** — "// fix this", "// hack". Either explain what's wrong and what should replace it, or delete.

5. **Wall-of-text comments** — break into shorter sentences, or convert to a doc comment above the function if that's where it really belongs.

6. **Numbered step markers in long methods** (`// 1) ...`, `// 2) ...`) — these are fine to keep when they break a procedure into readable phases, but rewrite them to explain *why* each phase exists rather than just narrating *what* happens. For example, `// 1) Decrypt encrypted PKCS#8 -> unencrypted PKCS#8 PEM` should become something like `// Snowflake's JWT authenticator requires an unencrypted PKCS#8 PEM, so the configured (encrypted) key is decrypted in-memory just before use.`

When deleting or substantially rewriting a comment, briefly mention to the user what you removed and why, so they can sanity-check.

## Step 6 — Show your work

When delivering commented code:

- If the file is small (< ~50 lines), show the full updated file inline.
- If the file is larger, edit it in place using `str_replace` or by writing the new version, then summarize what you added/changed.
- For review tasks, list the comments you removed or rewrote with a one-line justification each, so the user can spot-check.

## Examples

### Adding comments to bare C#

**Input:**
```csharp
public class RateLimiter {
    private readonly Dictionary<string, DateTime> _lastCall = new();
    private readonly TimeSpan _window;

    public RateLimiter(TimeSpan window) { _window = window; }

    public bool TryAcquire(string key) {
        if (_lastCall.TryGetValue(key, out var last) && DateTime.UtcNow - last < _window)
            return false;
        _lastCall[key] = DateTime.UtcNow;
        return true;
    }
}
```

**Output:**
```csharp
/// <summary>
/// In-memory rate limiter using a fixed time window per key.
/// Not thread-safe — wrap calls in a lock if used from multiple threads.
/// </summary>
public class RateLimiter {
    private readonly Dictionary<string, DateTime> _lastCall = new();
    private readonly TimeSpan _window;

    /// <summary>
    /// Creates a limiter that allows one call per <paramref name="window"/> per key.
    /// </summary>
    public RateLimiter(TimeSpan window) { _window = window; }

    /// <summary>
    /// Attempts to acquire a slot for the given key.
    /// </summary>
    /// <returns>True if the call is allowed; false if rate-limited.</returns>
    public bool TryAcquire(string key) {
        if (_lastCall.TryGetValue(key, out var last) && DateTime.UtcNow - last < _window)
            return false;
        _lastCall[key] = DateTime.UtcNow;
        return true;
    }
}
```

Note: no inline comment was added inside `TryAcquire` — the code is short and reads cleanly.

### Adding comments to a React component

**Input:**
```tsx
export function useDebouncedValue<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}
```

**Output:**
```tsx
/**
 * Returns a value that only updates after `delay` ms have passed without changes.
 * Useful for search inputs to avoid firing a request on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        // Reset the timer whenever value or delay changes; cleanup cancels the pending update.
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
```

The single inline comment earns its place because it explains the *intent* of the effect's cleanup, not the mechanics.

## What to avoid

- Don't change code semantics while commenting. If you spot a bug, mention it separately to the user — don't silently fix it.
- Don't add author/date headers unless the file already uses that convention.
- Don't translate variable names into English in comments. Rename the variable instead, if anything.
- Don't add `// TODO` unless the user has indicated something is actually pending.
