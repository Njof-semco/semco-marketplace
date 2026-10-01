# PowerShell

Inline: `#`. Comment-based help (`<# .SYNOPSIS #>`) only on scripts or functions other people run, and then only `.SYNOPSIS` plus any parameter with a trap.

## Help block (only for scripts others run)

```powershell
<#
.SYNOPSIS
Deploys the API to the given slot and swaps it to production when health checks pass.
#>
param(
    [Parameter(Mandatory)] [string] $ResourceGroup,
    [string] $Slot = 'staging'
)
```

No help block on small internal functions:

```powershell
function Get-ConnectionString([string] $Environment) {
```

## Inline comment

```powershell
# -ErrorAction Stop: Remove-Item only warns on locked files, the deploy must fail instead
Remove-Item -Path $DeployFolder -Recurse -Force -ErrorAction Stop
```

## Bad to good

```powershell
# Bad
# Loop through the files
foreach ($file in $files) {

# Good: no comment
foreach ($file in $files) {
```
