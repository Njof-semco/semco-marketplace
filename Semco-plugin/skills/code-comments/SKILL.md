---
name: code-comments
description: Rules for code comments and doc comments in any language. Use whenever writing or editing code, and when asked to add, review, trim or clean up comments. Keeps comments few, short (max 2 lines) and about the code as it is now, never about the conversation or the change history.
---

# Code Comments

Few comments, short comments, and only where the code cannot speak for itself.
Most code needs no comments. Good names and types do the explaining.

## Hard rules

These apply to every comment, including doc comments. Breaking one means the comment is deleted or rewritten.

**1. Describe the code as it is now. Never the history or the conversation.**
The reader has not seen the chat or the old version. Comments with these words almost always leak: "now", "changed", "previously", "fixed", "updated to", "instead of the old", "as requested", "as discussed", "per the user", "new:", "note:".

```csharp
// Bad: retries changed from 3 to 5 as discussed
// Good: the IFS gateway drops about 1 in 20 calls under load, so retry generously
private const int MaxRetries = 5;
```

**2. Max 2 lines, one idea per comment.** If it needs more, the code is probably unclear. Rename or split it instead.

**3. Never restate the code.** If the comment reads like the line below said out loud, delete it. When in doubt, leave it out.

```typescript
// Bad: set loading to true
setLoading(true);
```

**4. No file headers, section banners, author or date lines, and no comment on every field.**

**5. Doc comments only when the contract is not obvious** from the name and signature. Max 2 lines.
No `@param` / `<param>` / `@returns` lists unless one parameter has a non-obvious constraint, and then only for that parameter. Never `@example`. Skip getters, small helpers, constructors and anything private with a clear name.

```csharp
/// <summary>Returns null when the part is not in IFS, instead of throwing.</summary>
public Part? FindPart(string partNo)
```

## When a comment earns its place

- **Why** the code does something that looks odd or wrong but is intentional
- A workaround, trap or library quirk (`// EF tracks this entity, so detach before attaching the copy`)
- Units and magic numbers (`1048576 // 1 MB`)
- Ordering or side effects that matter (`// must run before SaveChanges, it sets the audit fields`)
- A return value or edge case a caller would not expect

## Patterns

**Types: one summary above, not one note per field.** Name fields in backticks. Keep an inline note only on the one field that would genuinely surprise someone.

```typescript
// Rows bucketed by why they did not go through: `conflicts` was rejected before sending, `missing` needs sub-parts created.
export interface TaskActionResult {
    conflicts: Array<{ id: string; error: string }>;
    missing: MissingSubPartTarget[];
}
```

**Long methods: numbered steps.** In a big method, short step markers help the reader follow the flow.

```csharp
// 1) Load the order and lock it
// 2) Recalculate totals from the lines
// 3) Push to IFS, then release the lock
```

**Reference constants, do not copy their value.** `// stale after STALE_THRESHOLD_SECS` not `// stale after 5 minutes`, the number drifts when the constant changes.

**TODO only when something is actually pending**, one line, with the reason: `// TODO: remove when IFS 24R1 is live, it fixes the date bug`.

## Writing new code

Write the code first, then add comments only at the spots listed under "When a comment earns its place".
A 30 line method usually needs zero or one comment. A class rarely needs a summary when its name is clear.

## Reviewing or cleaning up comments

1. Delete comments that restate the code, narrate obvious flow, or repeat a name.
2. Delete or fix comments that no longer match the code. A wrong comment is worse than none.
3. Rewrite leaked comments (rule 1) to describe the current code, or delete them.
4. Shorten anything over 2 lines. Shrink doc comments to the contract only.
5. Delete commented-out code.
6. Do not change behaviour while commenting. Report bugs you spot separately.

End with a short list of what was removed or rewritten, one line each with the reason.

## Final self-check

Before finishing, re-read every comment you added or kept and ask:

- Does it mention a change, a previous version, or something said in the chat? Rewrite or delete.
- Is it longer than 2 lines? Shorten.
- Would the code be just as clear without it? Delete.

## Language examples

Read only the file for the language being edited:

| Language | File |
|---|---|
| C# | [references/csharp.md](references/csharp.md) |
| TypeScript, JavaScript, React | [references/typescript-react.md](references/typescript-react.md) |
| SQL | [references/sql.md](references/sql.md) |
| Python | [references/python.md](references/python.md) |
| Java, Kotlin | [references/java-kotlin.md](references/java-kotlin.md) |
| C, C++ | [references/c-cpp.md](references/c-cpp.md) |
| PowerShell | [references/powershell.md](references/powershell.md) |
| Bash, shell | [references/bash.md](references/bash.md) |
| YAML, Azure Pipelines | [references/yaml-pipelines.md](references/yaml-pipelines.md) |
| Bicep, Terraform | [references/bicep-terraform.md](references/bicep-terraform.md) |
| CSS, SCSS | [references/css-scss.md](references/css-scss.md) |
| HTML, Razor | [references/html-razor.md](references/html-razor.md) |

Failure modes with fixes: [references/Bad-examples.md](references/Bad-examples.md).
