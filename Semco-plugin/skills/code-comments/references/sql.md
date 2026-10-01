# SQL

Inline: `--`. No header block above procedures, the name and parameters explain them.
Put one short comment above a procedure only when its contract is not obvious.

## Procedure comment (only when needed)

```sql
-- Returns one row per vessel, vessels without readings get NULL values instead of being left out.
CREATE PROCEDURE dbo.GetLatestFuelReadings
    @FromDate DATE
AS
```

## Inline comment

```sql
SELECT o.OrderNo, l.LineNo, l.Quantity
FROM dbo.Orders o
-- LEFT JOIN: cancelled lines are deleted, the order header must still show up
LEFT JOIN dbo.OrderLines l ON l.OrderId = o.Id
WHERE o.CreatedAt >= @FromDate;
```

```sql
-- READPAST: skip rows another worker has locked, so parallel jobs do not block each other
SELECT TOP (1) Id FROM dbo.Queue WITH (UPDLOCK, READPAST) WHERE Status = 0;
```

## Bad to good

```sql
-- Bad
-- =============================================
-- Author:      Someone
-- Create date: 2024-01-01
-- Description: Gets orders
-- =============================================
-- Select the orders
SELECT * FROM dbo.Orders;

-- Good: no comment needed
SELECT * FROM dbo.Orders;
```
