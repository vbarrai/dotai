#!/bin/bash
# Block dangerous commands like rm -rf /, drop database, etc.
# This script is automatically copied to .agents/hooks/block-dangerous-commands/

TOOL_INPUT="${TOOL_INPUT:-}"

DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "DROP DATABASE"
  "DROP TABLE"
  "mkfs\."
  "> /dev/sda"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$TOOL_INPUT" | grep -qi "$pattern"; then
    echo "BLOCKED: Detected dangerous pattern: $pattern" >&2
    exit 2
  fi
done

exit 0
