Check accessibility, SEO, performance and consistency of this Shopify section, snippet or Piece: $ARGUMENTS

Read `.cursorrules` first for the project conventions, then the file and everything it renders or loads (snippets passed through `render`, the Piece and its CSS in `resources/`, the locale keys it uses in `locales/en.default.json` and `locales/fr.json`, plus any other locale the project maintains). Do not edit files: report findings only.

Output: findings grouped by severity (🔴 bug / 🟠 should fix / 🟡 nice to have), one line each: `file:line — problem — suggested fix`. Skip praise. End with the list of fixes you would apply first, and ask before applying any.

Check:

Accessibility
- landmarks and semantics: `<section>` / `<article>` / `<nav>` / `<header>` used for what they mean, a section with a visible heading uses `aria-labelledby`
- heading levels: a section heading is `h2`, card titles below it `h3`, no skipped level, no heading styled as text or text styled as heading
- ARIA: only valid roles and attributes (`aria-roledescription` needs an explicit role, no `aria-*` on a plain `div` without a role), no redundant ARIA on native elements
- links and buttons: every link has an `href` (guard blank settings), an accessible name that makes sense out of context, no nested interactive elements, `target='_blank'` has `rel` and an announced new window
- focus: visible focus state, every hover-only reveal also works with `focus-visible` (or `group-focus-visible`) and on touch
- images: `alt` comes from the media alt (Shopify file alt) or is empty for decorative images, never the file name
- motion: hover / reveal transitions respect `prefers-reduced-motion` (`motion-safe:` / `motion-reduce:`), autoplay can pause
- text from settings is escaped (`| escape`) unless it is richtext

SEO
- one meaningful heading per section, link text that describes the target (not a generic "Discover" / "Read more" alone)
- every visible string comes from settings or locales, and every locale key exists in every maintained locale
- structured content stays crawlable (no text only injected by JS, no content hidden with `display:none` that should be indexed)

Performance
- `render-image` / `media-selector` used, `sizes` matches the real rendered width at each breakpoint, `loading='lazy'` below the fold and `eager` + `fetchpriority='high'` only for the LCP image
- width / height or `aspect-ratio` set so there is no layout shift
- videos lazy (`render-video` with `videoDetector: true`, driven by the `video-detector` Piece), no autoplay video above the fold without a poster
- JS: listeners removed in `unmount()`, no layout reads on every frame, work paused when out of view
- CSS: no duplicated fade (`fx-reveal-*` on a parent and its children) unless intended, transitions on `transform` / `opacity` only

Consistency
- identify inconsistencies: duplicated patterns, dead code (unused snippets, sections or Pieces, references to missing files, Dawn leftovers), opportunities for abstraction
- compare with the sibling sections (same name prefix or same role) for markup, spacing (`u-px-layout`, `u-grid-layout`, `u-py-module`) and naming, and grep the theme before calling something unused (`render`, `section` type in `templates/*.json` and `sections/*.json`, tag in `resources/js/components.js`)

Also run `shopify theme check` on the file and include its errors.
