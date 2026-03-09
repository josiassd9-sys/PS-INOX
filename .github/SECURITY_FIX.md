# Security Fix Instructions

## Revoking Keys
1. Identify the compromised keys.
2. Revoke access for the compromised keys immediately.
3. Generate new keys as needed.

## Rewriting History
- Be aware that rewriting history can have significant consequences, especially on shared branches.
- Use the following commands with caution:
  ```bash
  git filter-repo --path <path_to_file> --invert-paths
  ```

## Checklist
- [ ] Have you revoked all compromised keys?
- [ ] Have you informed your team about the changes?
- [ ] Have you generated and distributed new keys?