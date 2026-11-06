Refactor this Shopify section (or snippet): $ARGUMENTS

Read `.cursorrules` first for the project conventions, and use `sections/rich-text.liquid` as the reference.

Goals:

- match the project conventions (`u-*` utilities, Tailwind tokens and custom variants, scroll and `fx-reveal-*` attributes)
- reduce duplication: extract repeated markup into snippets, move logic into a `{%- liquid -%}` tag
- improve Tailwind consistency: replace arbitrary values with existing tokens, keep breakpoints consistent
- keep the schema, setting ids and locale keys backward compatible (renaming a setting id resets merchant content), unless told otherwise
- leave Alpine data and Pieces' public methods untouched unless the refactor requires it

Run `shopify theme check` on the changed files, then summarise what changed and why.
