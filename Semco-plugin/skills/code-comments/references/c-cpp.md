# C, C++

Inline: `//`. Doc comments: `///` or `/** ... */` (Doxygen) on one line when it fits.
Put the doc comment in the header, not again in the source file.

## Doc comment (only when the contract is not obvious)

```cpp
/// Caller owns the returned buffer and must free it with release_frame().
Frame* decode_frame(const uint8_t* data, size_t length);
```

No doc comment needed:

```cpp
int clamp_percent(int value);
```

## Inline comment

```c
// Registers are big-endian on this sensor, swap before use
uint16_t raw = __builtin_bswap16(read_register(REG_TEMPERATURE));
```

```cpp
buffer.reserve(MAX_PACKET_SIZE); // avoids reallocations in the receive loop
```

## Bad to good

```cpp
// Bad
// Increment i
++i;

// Good: no comment
++i;
```
