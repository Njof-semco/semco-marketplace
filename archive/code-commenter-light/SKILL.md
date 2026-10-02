---
name: code-commenter-light
description: Add minimal, high-value inline comments to C#, JavaScript, TypeScript, JSX, and TSX code WITHOUT adding doc comments, summary blocks, JSDoc, or XML documentation above functions and classes. Use this skill when the user wants a lightweight, low-noise commenting pass — phrases like "add light comments", "simple comments", "just inline comments", "comment this but keep it clean", "don't add docstrings", "no summary blocks", "minimal comments", or "comment the tricky parts only". Also use when the user has explicitly said they want fewer comments, a cleaner look, or has rejected a more thorough commenting style. Trigger this instead of the heavier doc-style skill whenever the user signals they want a lighter touch. Also use to review and trim existing comments back to the essentials.
---

# Code Commenter (Light)

Add only the comments that genuinely help a reader. No doc blocks, no summary headers, no JSDoc, no XML doc comments. Just sparse, well-placed inline `//` comments where the code's intent isn't obvious from the code itself.

## Core philosophy

Most code doesn't need comments. Names, structure, and types already do most of the explaining. A comment earns its place only when it adds something the code can't say on its own.

This skill is the **lightweight** counterpart to `code-commenter-full`. If the user wants doc comments above every function and class, use that one instead. This one stays out of the way.

## Step 1 — Detect the language

| Extension | Language | Comment syntax |
|---|---|---|
| `.cs` | C# | `// ...` |
| `.js`, `.jsx` | JavaScript / React | `// ...` |
| `.ts`, `.tsx` | TypeScript / React | `// ...` |

For other languages, use the closest single-line comment syntax for that language and mention to the user that this skill is tuned for C# and React/JS/TS.

## Step 2 — What this skill does NOT add

Do not add any of the following, even when reviewing or improving code:

- XML doc comments (`/// <summary>`, `<param>`, `<returns>`)
- JSDoc blocks (`/** ... */`)
- TypeScript doc comments
- File-header comments
- Author/date banners
- Section dividers like `// ===== HELPERS =====`

If the user later asks for these, switch to the full version of the skill.

## Step 3 — Where inline comments earn their place

Add a `// ...` comment when:

- A line looks wrong but is intentional (`// off-by-one is correct here — API uses 1-based indexing`)
- A workaround exists for a known bug, library quirk, or browser issue
- A magic number or string has meaning that isn't obvious from context (`// 2592000 = 30 days in seconds`)
- A regex, bitwise op, or dense expression would benefit from a plain-English summary
- A non-obvious side effect or ordering requirement matters (`// must dispose before rethrow — OpenAsync may have allocated unmanaged resources`)
- A `TODO`, `FIXME`, or `HACK` is genuinely needed and the user has indicated something is pending

## Step 4 — What NOT to comment

Do not add comments that:

- Restate the next line in English (`// increment counter` above `counter++`)
- Narrate obvious control flow (`// loop through users`, `// return result`)
- Re-state what a well-named variable already says
- Explain language features (`// arrow function`, `// async method`)
- Summarize a function from above — that's a doc comment, not an inline comment, and this skill doesn't do those

When in doubt, leave it out. A function with zero comments is fine if it reads cleanly.

## Step 5 — Reviewing existing comments

When asked to review or clean up:

1. **Delete redundant comments** that restate code.
2. **Fix or delete outdated comments** that no longer match the code. Outdated comments are worse than missing ones — they actively mislead.
3. **Delete commented-out code** unless there's a real reason to keep it (and if so, add one short note explaining why).
4. **Remove vague placeholders** like `// fix this` or `// hack` unless they explain what's wrong and what should replace them.
5. **Strip doc/summary blocks** if the user is using this skill to *reduce* commenting — they've explicitly asked for the lighter style. Mention what you removed so they can sanity-check.
6. **Keep step-marker comments** in long methods (`// 1) ...`, `// 2) ...`) when they break a procedure into readable phases — but rewrite them to explain *why* each phase exists rather than just narrating *what* happens.

When deleting or rewriting comments, list what you changed at the end with a one-line reason each.

## Step 6 — Show your work

- For files under ~50 lines, show the full updated file inline.
- For larger files, edit in place and summarize what you added, removed, or rewrote.
- For review tasks, list every comment you removed or changed with a one-line justification.

## Examples

### C# — bare code, light pass

**Input:**
```csharp
public sealed class RateLimiter
{
    private readonly Dictionary<string, DateTime> _lastCall = new();
    private readonly TimeSpan _window;

    public RateLimiter(TimeSpan window) { _window = window; }

    public bool TryAcquire(string key)
    {
        if (_lastCall.TryGetValue(key, out var last) && DateTime.UtcNow - last < _window)
            return false;
        _lastCall[key] = DateTime.UtcNow;
        return true;
    }
}
```

**Output:**
```csharp
public sealed class RateLimiter
{
    // Not thread-safe — wrap calls in a lock if used from multiple threads.
    private readonly Dictionary<string, DateTime> _lastCall = new();
    private readonly TimeSpan _window;

    public RateLimiter(TimeSpan window) { _window = window; }

    public bool TryAcquire(string key)
    {
        if (_lastCall.TryGetValue(key, out var last) && DateTime.UtcNow - last < _window)
            return false;
        _lastCall[key] = DateTime.UtcNow;
        return true;
    }
}
```

The class name plus method name plus types tell the reader almost everything. The single comment captures the one thing the code can't express on its own — thread-safety. No summary block. No `<param>` for `key`.

### React/TS — bare hook, light pass

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

No JSDoc block. The hook's name and TypeScript signature already tell the reader what it does and how to call it. The single inline comment explains the cleanup's purpose, which isn't obvious from the code.

### Reviewing — stripping noise

**Input:**
```javascript
// This is the user controller
class UserController {
    // Constructor
    constructor(db) {
        // store the db
        this.db = db;
    }

    // Get user by id
    async getUser(id) {
        // query the database
        const user = await this.db.users.findById(id);
        // return the user
        return user;
    }
}
```

**Output:**
```javascript
class UserController {
    constructor(db) {
        this.db = db;
    }

    async getUser(id) {
        const user = await this.db.users.findById(id);
        return user;
    }
}
```

**Removed:**
- `// This is the user controller` — restates the class name
- `// Constructor`, `// store the db` — restate language syntax
- `// Get user by id` — restates the method name
- `// query the database`, `// return the user` — narrate obvious lines

## What to avoid

- Don't change code semantics while commenting. If you spot a bug, raise it separately to the user — don't silently fix it.
- Don't translate variable names into English in comments. Suggest a rename instead, if anything.
- Don't add `// TODO` unless something is actually pending and the user knows about it.
- Don't add a doc comment, ever — even if it feels like the function "deserves" one. That's the other skill.
