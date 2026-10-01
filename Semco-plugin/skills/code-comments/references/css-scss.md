# CSS, SCSS

Inline: `/* ... */` in CSS, `//` also works in SCSS. No section banners.
Comment values that look arbitrary, browser workarounds, and stacking or specificity tricks.

## Inline comment

```scss
.modal {
  z-index: 1100; // above the header (1000), below toasts (1200)
}
```

```css
.table-wrapper {
  /* min-width: 0 lets the flex child shrink, otherwise wide tables overflow the page */
  min-width: 0;
}
```

## Bad to good

```css
/* Bad */
/* ===== BUTTONS ===== */
/* Make the button blue */
.button-primary {
  background: var(--color-primary);
}

/* Good: no comment */
.button-primary {
  background: var(--color-primary);
}
```
