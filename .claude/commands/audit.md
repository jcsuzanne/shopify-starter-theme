Audit this Shopify section, snippet or Piece: $ARGUMENTS

Read `.cursorrules` first for the project conventions. Do not edit files: report findings only, one line each (`file:line — problem — suggested fix`), grouped by severity.

Check:

- Liquid: logic in the markup that belongs in a `{%- liquid -%}` tag, unescaped output (`| escape`), hardcoded copy instead of settings or locales, missing `{{ block.shopify_attributes }}`, unused settings or variables
- schema: missing or inconsistent `t:` keys, sensible defaults and presets
- Tailwind: arbitrary values where a token exists, inconsistent breakpoints, duplicated class sets that should be a utility or snippet
- spacing: `u-px-layout`, `u-grid-layout`, `u-py-module` used consistently with the other sections
- JS: Piece listeners removed in `unmount()`, work done in `afterMount()` when it needs the full DOM, Alpine vs Piece responsibilities respected
- images and performance: `render-image` used, `loading` / `fetchpriority` set correctly, no layout shift
- accessibility: semantic HTML, headings order, alt texts, focus states, aria on interactive elements, reduced motion for animations
- responsive problems
- DRY patterns worth extracting

Also run `shopify theme check` on the files and include its errors.
