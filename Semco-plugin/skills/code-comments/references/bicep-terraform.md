# Bicep, Terraform

Bicep inline: `//`, parameter docs: `@description('...')`.
Terraform inline: `#`, variable docs: `description = "..."`.
Use the built-in description only when the name does not explain the value. Comment settings whose reason is not obvious.

## Description (only when the name is not enough)

```bicep
@description('Must be globally unique, used as the storage account name.')
param storageName string
```

```hcl
variable "retention_days" {
  type        = number
  description = "Applies to both logs and backups."
}
```

## Inline comment

```bicep
properties: {
  // Required by the IFS connector, it does not support TLS 1.3 yet
  minimumTlsVersion: 'TLS1_2'
}
```

```hcl
lifecycle {
  # The app scales itself, Terraform must not reset the instance count
  ignore_changes = [instance_count]
}
```

## Bad to good

```bicep
// Bad
// The location parameter
@description('The location.')
param location string = resourceGroup().location

// Good: no comment, no description
param location string = resourceGroup().location
```
