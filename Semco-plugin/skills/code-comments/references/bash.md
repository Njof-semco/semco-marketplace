# Bash, shell

Inline: `#`. No header block. A script that others run may have one usage line at the top.

## Usage line (only for scripts others run)

```bash
#!/usr/bin/env bash
# Usage: backup-db.sh <database> [target-dir]
set -euo pipefail
```

## Inline comment

```bash
# -print0 / -0: file names from users can contain spaces
find "$UPLOAD_DIR" -name '*.tmp' -print0 | xargs -0 rm -f
```

```bash
# The container needs a few seconds before the port answers, health check would fail otherwise
sleep 5
```

## Bad to good

```bash
# Bad
# Set the variable
TARGET_DIR="/var/backups"

# Good: no comment
TARGET_DIR="/var/backups"
```
