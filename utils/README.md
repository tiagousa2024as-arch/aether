# Utils

- **Shared helpers**: Prefer `@/lib/utils` (cn, etc.) for UI/utils used across app.
- **Pure helpers**: Place domain-specific pure functions here (e.g. date formatting, validation helpers, constants).
- **Server-only**: Keep server-side helpers in `server/` (e.g. server/utils).
