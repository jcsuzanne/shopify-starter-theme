You are in ANALYSIS ONLY mode.

Do not edit source code files.
Do not refactor components.
Do not modify Liquid, JSON, CSS or JS files of the theme.

Only:

- analyze the project again (`layout/`, `sections/`, `snippets/`, `templates/`, `resources/js`, `resources/css`, `vite.config.js`, `package.json`)
- update `CLAUDE.md` (git-ignored, create it if missing) with the current architecture, and keep `.cursorrules` in sync when the conventions changed
- generate architectural recommendations
- identify inconsistencies: duplicated patterns, dead code (unused snippets, sections or Pieces, references to missing files, Dawn leftovers), opportunities for abstraction
- include the `shopify theme check` summary

I repeat, do not modify any source files.
Only suggest changes and update documentation files.
Write the audit to `.docs/audit.md`.
