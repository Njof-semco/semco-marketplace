# YAML, Azure Pipelines

Inline: `#`. No header block. Step `displayName` already describes each step, so do not repeat it in a comment.
Comment a value only when the reason for it is not obvious.

## Inline comment

```yaml
trigger:
  branches:
    include: [main]
  # Docs-only changes do not need a build
  paths:
    exclude: ['docs/*', '*.md']
```

```yaml
- task: DotNetCoreCLI@2
  displayName: Run tests
  inputs:
    command: test
    # Integration tests need the shared DB, they run in the nightly pipeline instead
    arguments: '--filter Category!=Integration'
```

## Bad to good

```yaml
# Bad
# Restore NuGet packages
- task: DotNetCoreCLI@2
  displayName: Restore NuGet packages
  inputs:
    command: restore

# Good: displayName already says it
- task: DotNetCoreCLI@2
  displayName: Restore NuGet packages
  inputs:
    command: restore
```
