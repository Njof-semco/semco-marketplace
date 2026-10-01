# TypeScript, JavaScript, React

Inline: `//`. Doc comments: `/** ... */` on one line when it fits.

## Doc comment (only when the contract is not obvious)

```typescript
/** Resolves to null on 404 instead of throwing, other errors still throw. */
export async function fetchVessel(vesselId: string): Promise<Vessel | null>
```

No doc comment needed:

```typescript
export function formatCurrency(amount: number, currency: string): string
```

## Props

Comment only the prop that would surprise someone, not every prop.

```tsx
interface WorkOrderTableProps {
    rows: WorkOrderRow[];
    onSelect: (rowId: string) => void;
    /** Rows are compared by reference, pass a memoized array or the table re-renders every time. */
    selectedRows: WorkOrderRow[];
}
```

## Inline comment

```tsx
useEffect(() => {
    // Skip until saved filters are restored, otherwise the first load fetches twice
    if (!hasHydrated) {
        return;
    }
    loadWorkOrders(filters);
}, [hasHydrated, filters]);
```

## Bad to good

```typescript
// Bad
/**
 * Fetches users.
 * @param page - The page.
 * @returns The users.
 * @example const users = await getUsers(1);
 */
export async function getUsers(page: number): Promise<User[]>

// Good: page is 1-based, which is the one thing worth saying
/** `page` is 1-based. */
export async function getUsers(page: number): Promise<User[]>
```
