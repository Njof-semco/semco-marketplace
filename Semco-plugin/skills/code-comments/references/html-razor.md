# HTML, Razor

HTML: `<!-- ... -->`, sent to the browser, so never put internal details in it.
Razor: `@* ... *@`, stays on the server, prefer it in `.cshtml` and `.razor` files.
No banners marking where sections start or end, the markup shows that.

## Inline comment

```cshtml
@* Rendered server-side so the price is correct even when JS is blocked *@
<span class="price">@Model.TotalPrice.ToString("C")</span>
```

```razor
@* Key on Id: without it Blazor reuses rows and the checkbox state jumps to the wrong row *@
@foreach (var row in Rows)
{
    <WorkOrderRow @key="row.Id" Row="row" />
}
```

## Bad to good

```html
<!-- Bad -->
<!-- Start of footer -->
<footer>...</footer>
<!-- End of footer -->

<!-- Good: no comment -->
<footer>...</footer>
```
