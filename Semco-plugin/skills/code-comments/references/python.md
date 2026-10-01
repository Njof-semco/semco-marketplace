# Python

Inline: `#`. Docstrings: `"""..."""` on one line when it fits. No module docstrings.

## Docstring (only when the contract is not obvious)

```python
def load_readings(path: Path) -> list[Reading]:
    """Skips rows with a missing timestamp instead of raising."""
```

No docstring needed:

```python
def celsius_to_fahrenheit(celsius: float) -> float:
```

## Inline comment

```python
# Oldest first: newer items are often edited again, so processing them last saves work
queue.sort(key=lambda item: item.created_at)
```

## Bad to good

```python
# Bad
def get_user(user_id: str) -> User:
    """
    Gets a user.

    Args:
        user_id: The id of the user.

    Returns:
        The user.

    Example:
        >>> get_user("abc")
    """

# Good: no docstring, the signature already says this
def get_user(user_id: str) -> User:
```
