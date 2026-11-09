Sync the design foundations (typography, colors, spacing, grid) from Figma to the code: $ARGUMENTS

Arguments:
- `check` (default): compare Figma with the stored snapshot and report. No file edits.
- `update`: same comparison, then regenerate the code once the user has validated the report.
- An optional Figma URL pointing to a « Design Tokens — Snapshot … » frame (output of the plugin described in `.docs/figma-plugin-prompt.md`). Without it, read Figma directly.

Read first: `.cursorrules`, `.docs/figma.md` (file key, reference page, token convention, measured spacing, decisions), `.docs/figma-tokens.json` (last validated snapshot, absent before the first sync), `resources/css/tailwind-config.css`, `resources/css/common/typography.css` (absent before the first sync), `resources/css/utilities/utilities.css`.

If `.docs/figma.md` still has placeholders for the file key or the reference page, stop and ask for them.

## Hard rules

- Figma is read-only. Never create, bind, rename or delete anything in the Figma file (no mutating `use_figma` call, no `saveVersionHistoryAsync`). Read-only `use_figma` scripts, `get_metadata`, `get_variable_defs` and `get_screenshot` only.
- Never override Tailwind default names (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`…) and never reset a namespace with `initial`.
- Token naming follows the « Convention de tokens » section of `.docs/figma.md`: word tiers (`tiny`, `small`, `medium`, `large`, `huge`, `giant`, `display`, `monument`) with `-minus` / `-plus` variants around a base. Two values in a tier: base is the smaller. Three values: base is the middle one. Never more than three per tier.
- Mobile-first with Tailwind variants (`lg:`, `md:`). Never write a raw `@media` with px values. Figma mobile style (`XS` / `S`) = base, desktop style (`M` / `L`) = `lg:`, unless `.docs/figma.md` defines another suffix mapping.
- Generated `u-*` utilities carry everything the Figma style defines: font family, weight, italic, text case, decoration, tracking, size, line height. No hand-added `italic` / `uppercase` in the markup.
- Never silently rename or remove an existing token. Any rename, removal or new tier goes in the report and waits for the user.

## 1. Collect

- With a snapshot URL: read the text node named `tokens.json` inside the frame (read-only `use_figma`) and `JSON.parse` it.
- Without: create a Figma session on the file key from `.docs/figma.md`, then on the reference page read with one read-only `use_figma` call: local text styles (family, style, weight, italic, size, lineHeight, letterSpacing, textCase, textDecoration, usage count on the page), local paint styles (hex), local variables (all modes), layout grids of top-level frames, unstyled texts grouped by family + style + size + lineHeight.
- Spacing: when the file has spacing variables, use them. Otherwise re-measure only `margin`, `gutter` and `section` (grid margins and module paddings on the pages listed in `.docs/figma.md`).
- Normalise to the snapshot shape below.
- In `unstyledTexts`, ignore font families used by no text style: they are mockup annotations (sitemap numbers, captions), not content. Mention their count in one line.

Snapshot shape (`.docs/figma-tokens.json`):

```json
{
  "meta": { "file", "fileKey", "page", "source", "generatedAt", "validatedAt" },
  "decisions": { "<style or token>": "<decision taken with the user>" },
  "textStyles": [ { "name", "family", "style", "weight", "italic", "size", "lineHeight": { "unit", "value" }, "letterSpacing": { "unit", "value" }, "textCase", "textDecoration" } ],
  "paintStyles": [ { "name", "hex", "type" } ],
  "variables": [ { "collection", "name", "type", "scopes", "values" } ],
  "grids": {
    "desktop": { "width", "columns", "columnWidth", "gutter", "margin" },
    "mobile": { "width", "columns", "columnWidth", "gutter", "margin" }
  },
  "measuredSpacing": {
    "margin": { "mobile", "desktop" },
    "gutter": { "mobile", "desktop" },
    "section": { "mobile", "desktop", "source" }
  },
  "unstyledTexts": [ { "family", "style", "size", "lineHeight", "count" } ]
}
```

`source` is « plugin snapshot <node id> » or « direct read ». Usage counts are not stored: they change with every mockup edit.

## 2. Compare and report

Diff against `.docs/figma-tokens.json`. Before the first sync there is no snapshot: diff against the current CSS and say so at the top of the report.

Report in French, grouped:

- **Bloquant**: a font size with no token in the convention, a style whose desktop/mobile split is ambiguous (e.g. both `S` and `XS`), a changed font family, a changed grid (columns, gutter, margin), a changed `section` value.
- **À valider**: changed size, line height, weight, case or decoration on an existing style; new or removed style; new or changed color.
- **Info**: usage counts, unstyled texts, values outside the scale seen in the mockups.

For every new size, propose a token name following the tier rule, and say which existing token would shift if the tier gets a third value. For every change, list the code impacted (`grep` the token and the `u-*` utility in `sections/`, `snippets/`, `blocks/`, `layout/`, `templates/`, `resources/`).

Before the first sync, also add a **Migration du starter** group: the starter tokens to replace (see below), each one with its usages and the proposed replacement token.

In `check` mode, stop here.

## 3. Update (only with `update` and after the user validated the report)

- `resources/css/tailwind-config.css`: rewrite only the fonts (`--font-*`), `--color-*`, `--text-*`, `--leading-*` and `--spacing-*` token blocks, and the responsive overrides (`:root { @variant lg { … } }`). Keep the app height vars, breakpoints, z-index, easings, custom media and variants untouched.
- `resources/css/common/typography.css`: regenerate the Figma-derived `u-*` utilities, one `@utility` per text style (`font-family: var(--font-*)` then one `@apply`), mobile-first, ordered like the Figma styles. Keep any hand-written utility that has no Figma style and mention it.
- Migrate usages of renamed or removed tokens and utilities.
- Write the validated snapshot to `.docs/figma-tokens.json` and fill the tables, the decisions and the « Écarts relevés » section in `.docs/figma.md` (date of the sync).
- Run `pnpm build` (with pnpm 11) and report errors. Then `touch vite.config.js` so a running Vite restores the dev `vite-tag.liquid`. Do not commit.

### First update of a project

The starter ships placeholder tokens that the Figma ones replace. On the first `update`, after validation:

- Remove the starter tokens from `tailwind-config.css`:
  - spacing `--spacing-tiny`, `--spacing-small`, `--spacing-unit`, `--spacing-double`, `--spacing-huge`, `--spacing-outer-x-*`, `--spacing-outer-y-*` (`--spacing-hview` stays, it is not a design value);
  - sizes `--text-xxxs`, `--text-xxs`, `--text-xsm`, `--text-sml` and any `--text-size-*`;
  - line heights `--leading-*` (line heights move into the `u-*` utilities);
  - the demo color `--color-midnight`.
- Add the Figma tokens: fonts, colors, sizes and spacing in `@theme`, then `margin`, `gutter` and `section` with the mobile value in `@theme` and the desktop value in `:root { @variant lg { … } }`.
- Create `resources/css/common/typography.css` and import it in `resources/css/main.css` after `./common/animations.css`.
- Rewrite the layout utilities in `resources/css/utilities/utilities.css` on the new tokens, keeping their names and modifiers:
  - `u-px-layout` / `u-pl-layout` / `u-pr-layout` → `px-margin` / `pl-margin` / `pr-margin`;
  - `u-py-module` / `u-pb-module` / `u-pt-module` → `py-section` / `pb-section` / `pt-section` (`--no-lg` → `lg:py-0`, `--desktop` → `pt-0 lg:pt-section`);
  - add `u-grid-layout` (`grid grid-cols-<mobile> gap-x-gutter lg:grid-cols-<desktop>`, with a `--half` modifier) if it does not exist yet.
- Migrate every usage of the removed tokens (`grep -rnE` on `sections/ snippets/ blocks/ layout/ templates/ resources/`, including `var(--spacing-*)` in CSS and `translate-y-small`-like utilities), mapping each one to the closest Figma token or to an arbitrary value when nothing fits.
- Replace the token list in the Tailwind section of `.cursorrules` with the new tokens and `u-*` utilities.
- In the final report, list every removed token, every added token, and every migrated usage (`file:line — old → new`), with the arbitrary values left as fallbacks.
