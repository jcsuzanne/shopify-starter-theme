Create a new Shopify section: $ARGUMENTS

Read `.cursorrules` first for the project conventions (Tailwind tokens, `u-*` utilities, scroll attributes, Liquid rules), and look at `sections/rich-text.liquid` as the reference section.

Create:

- `sections/<name>.liquid`: markup + `{% schema %}` (name, settings, blocks, presets)
- the matching `t:sections.<name>.*` keys in `locales/en.default.schema.json` (and `locales/en.default.json` for front-end strings)
- a Piece only if the section needs JS behaviour (follow the "Details" rules in `.cursorrules`)

Rules:

- layout with `u-px-layout` / `u-grid-layout`, vertical spacing with `u-py-module` (or `u-pt-module` / `u-pb-module`)
- use the existing tokens and variants (`--spacing-*`, `text-*`, `from-lg:` / `to-lg:`, `inview:`) instead of arbitrary values
- images through `snippets/render-image.liquid`
- blocks with `{%- case block.type -%}` and `{{ block.shopify_attributes }}` on each block wrapper
- reuse existing snippets and Pieces when possible
- keep logic out of the markup: prepare variables in a `{%- liquid -%}` tag at the top
- HTML attributes in single quotes, no hardcoded copy (use settings or locales)
- run `shopify theme check` on the new file and fix the errors
