# Shopify Starter Theme

Starter theme for Shopify Online Store 2.0, built by [Index Studio](https://index.studio).
Vite, Tailwind CSS v4 and Pieces.js (native web components), with a local dev environment and hot reload.

## Stack

- [Vite 8](https://vite.dev) + [vite-plugin-shopify](https://github.com/barrel/shopify-vite) — single bundled `app.js` / `app.css`
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first config, no PostCSS
- [Pieces.js](https://github.com/quentinhocde/piecesjs) — lightweight web components
- [Alpine.js](https://alpinejs.dev) — cart drawer and product data
- [GSAP](https://gsap.com) + ScrollTrigger — scroll detection and animations
- [Lenis](https://lenis.darkroom.engineering) — smooth scroll (default, swappable for native scroll)
- [Swup](https://swup.js.org) — page transitions (opt-in)
- Prettier with the Liquid and Tailwind plugins

## Requirements

- Node.js >= 22.12
- [pnpm](https://pnpm.io) 11
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)

## Getting started

Get a copy without the starter history, then run the setup script. Two ways to start:

### Option 1 — Use this template (GitHub, recommended)

This repository is a GitHub **template repository**: GitHub can create a new repository from it, with all the files of `main` but none of its history. Unlike a fork, the new repository is independent (it can be private, nothing links it back to the starter except a "generated from" mention under its name), and unlike a clone it starts with a single commit.

From the GitHub UI:

1. On the starter page, click **Use this template** → **Create a new repository** (top right, next to the Code button).
2. Pick the owner (your account or the client's organization), the repository name, and **Private**.
3. Leave **Include all branches** unchecked (only `main` is needed).
4. Click **Create repository**, then clone it and run the setup:

```bash
git clone git@github.com:you/my-project.git
cd my-project
./setup.sh create
```

Or the same in one command with the GitHub CLI:

```bash
gh repo create my-project --template jcsuzanne/shopify-starter-theme --private --clone
cd my-project
./setup.sh create
```

`setup.sh` keeps this repository and its origin, and offers to commit the setup changes. Push them with `git push`.

> The template always copies the current `main`. To start from a specific starter version, use option 2.

### Option 2 — From a release tag

Any git host (GitLab, client repository…), pinned starter version. `degit` downloads the files of the tag without git history:

```bash
npx degit jcsuzanne/shopify-starter-theme#v1.6.1 my-project
cd my-project
./setup.sh create
```

### Setup script

| Command             | Description                                                                                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `./setup.sh create` | New project: renames it in `package.json` (version `0.1.0`), points the scripts at your store, sets up git (drops the starter history if the copy was cloned), installs, optionally creates the theme on the store, then makes the initial commit |
| `./setup.sh theme`  | Builds, pushes a new unpublished theme to the store and writes its id in the `package.json` scripts. Safe to re-run                                                                                                                               |
| `./setup.sh join`   | Existing project: checks node, pnpm 11 and the Shopify CLI, then installs                                                                                                                                                                         |

| Option        | Description                                     |
| ------------- | ----------------------------------------------- |
| `--yes`       | Accept every default instead of prompting       |
| `--no-update` | Skip the `pnpm update` that follows the install |

Each prompt can be answered from the environment: `PROJECT_NAME`, `PACKAGE_NAME`, `STORE`, `STORE_PASSWORD`, `THEME_NAME`. Set `THEME_ID` to use a theme that already exists on the store instead of creating one.

```bash
PROJECT_NAME="My Project" STORE=my-store ./setup.sh create --yes
```

> With `--yes`, `create` also creates the theme on the store and makes the initial commit.

## Development

```bash
pnpm dev
```

Runs both servers:

- `pnpm start` — Vite dev server on `http://127.0.0.1:3000` (JS/CSS with HMR)
- `pnpm shopify` — Shopify CLI theme server on `http://127.0.0.1:9292` (open this one)

They can also run in two separate terminals.

What reloads when:

| Change | Result                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------- |
| CSS    | Hot update, no reload                                                                                            |
| JS     | Full page reload (custom elements can't be redefined)                                                            |
| Liquid | CSS hot update for new Tailwind classes, the Shopify CLI hot reload refreshes the markup once the file is synced |

> `pnpm build` rewrites `snippets/vite-tag.liquid` to point at the production assets. If you build while developing, restart `pnpm start` to get the dev snippet (and HMR) back.

## Scripts

| Script                           | Description                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `pnpm dev`                       | Vite + Shopify CLI dev servers                                                                   |
| `pnpm start`                     | Vite dev server only                                                                             |
| `pnpm shopify`                   | Shopify CLI dev server only                                                                      |
| `pnpm build`                     | Clean old `assets/app.*` files and build                                                         |
| `pnpm deploy`                    | Push sections, snippets, assets, layout and blocks to the theme                                  |
| `pnpm push-*`                    | Push one part of the theme (`assets`, `snippets`, `config`, `locales`, `sections`, `templates`)  |
| `pnpm pull-*` / `pnpm sync-pull` | Pull config, locales, templates and header group from the theme                                  |
| `pnpm setup-store`               | Push the theme as a new unpublished theme (`./setup.sh theme` also writes its id in the scripts) |
| `pnpm logout`                    | Log out of the Shopify CLI                                                                       |

## Project structure

```
resources/
  js/
    app.js            Entry point: loads <c-app>, then the other pieces
    components.js     Registry of the pieces loaded on the page (and after each swup visit)
    components/       Pieces (web components)
    alpine/           Alpine data (DatasApp) + start.js
    datas/            Alpine data ProductDatas
    shopify/          Cart API helpers
    utils/            Device, sizes, helpers…
  css/
    main.css          Entry point, imports everything below
    tailwind-config.css  @theme tokens, custom media and variants
    base/ common/ utilities/ theme.css
snippets/vite-tag.liquid  Generated by vite-plugin-shopify (git-ignored)
```

### Pieces

Each piece is a custom element. To load one, add it to `components.js`:

```js
loadPiece(
  'my-piece',
  () => import('/resources/js/components/MyPiece.js'),
  context,
),
```

`BasePiece.js` is a template to start from. `afterMount()` is called once the DOM is ready (first load and after each swup visit).

## Scroll

`<c-scroll>` comes in two versions sharing `ScrollBase.js`. Pick one in `components.js`:

- `Scroll.js` (default) — Lenis smooth scroll, parallax, horizontal mode, scroll-to links
- `ScrollLite.js` — native scroll, lighter

Common attributes (full list at the top of `ScrollBase.js` and `Scroll.js`):

| Attribute                                        | Description                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| `data-scroll-item`                               | Detect the element: adds `is-inview` (use the `inview:` Tailwind variant) |
| `data-scroll-repeat`                             | Remove `is-inview` when the element leaves                                |
| `data-scroll-start` / `data-scroll-end`          | ScrollTrigger `start` / `end`                                             |
| `data-scroll-target`                             | Trigger on another element (id or CSS selector)                           |
| `data-scroll-progress-css`                       | Set `--progress` (0 to 1) on the element                                  |
| `data-scroll-call` / `data-scroll-progress-call` | Call a piece method on enter/leave or on progress                         |
| `data-scroll-parallax-from` / `-to`              | Parallax (Lenis version)                                                  |

On `<c-scroll>`, `data-scroll-vars` writes `--scrollValue` and `--scrollProgress` on `<html>` (opt-in, it restyles the page on each frame).

The default `rich-text` section is a playground for these attributes.

## Page transitions

Swup and its plugins are installed but disabled. To enable them, uncomment the `c-transitions` piece in `app.js`.

## Tailwind

- Theme tokens, breakpoints, easings and z-indexes live in `resources/css/tailwind-config.css`.
- Custom variants: `from-lg:` / `to-lg:` (and the other breakpoints), `inview:`, `cart-opened:`, `ui-ready:`, `backend-preview:` (theme editor)…
- No PostCSS: use `/* */` comments and CSS custom properties. `//` comments and `$vars` break the Tailwind parser.

## Design foundations from Figma

The starter tokens (`tiny`, `unit`, `outer-x-*`, `text-xxs`…) are placeholders: each project generates its own fonts, colors, sizes, spacing and text utilities from its Figma file with a Claude Code command. Figma is only read, never modified.

1. Fill `.docs/figma.md`: file key, reference page, and the screens and modules to measure. The token convention (word tiers `tiny` → `monument` with `-minus` / `-plus` variants, mobile-first) is documented there.
2. Optional: generate a snapshot frame in Figma with the « Design tokens snapshot » plugin (prompt in `.docs/figma-plugin-prompt.md`).
3. Run the command in Claude Code:

| Command                                       | Description                                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/forge-design-foundations check`             | Compare Figma with the last validated snapshot (`.docs/figma-tokens.json`) and report, no edits |
| `/forge-design-foundations update`            | Same report, then once validated rewrite the tokens, `typography.css` and the snapshot          |
| `/forge-design-foundations check <figma url>` | Read a snapshot frame made by the plugin instead of reading the file directly                   |

The first `update` replaces the starter tokens, migrates their usages and lists every change in its report.

## Deployment

Built assets (`assets/app.*`, `snippets/vite-tag.liquid`) are git-ignored, so build before pushing to the theme:

```bash
pnpm build
pnpm deploy
```

## FAQ

#### Authentication problem (e.g. 422 API request)

Log out of Shopify and Shopify Partners, check the owner status (dev store), log in with your own account, then restart the dev server:

```bash
pnpm logout
pnpm dev
```

#### `ERR_PNPM_UNEXPECTED_STORE` on install

`node_modules` was installed with another major version of pnpm. Use pnpm 11 (check `pnpm -v`).

## Credits

Made by [Index Studio](https://index.studio) — dev by [JCS](https://www.jcsuzanne.com) and [Quentin Hocdé](https://quentinhocde.com).

Code reference: [slayed](https://github.com/james0r/slayed).
