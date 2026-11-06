#!/usr/bin/env bash
#
# Turns a fresh copy of the starter into a new project.
#
#   ./setup.sh create   new project from the starter (name, store, git, install, theme)
#   ./setup.sh theme    create an unpublished theme on the store and wire its id
#   ./setup.sh join     set up a local environment on an existing project
#
# Every prompt takes a default from the environment, so it can run unattended:
#   PROJECT_NAME=… STORE=… ./setup.sh create --yes
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG="$ROOT/package.json"
STARTER_REPO="shopify-starter-theme"
ASSUME_YES=0
DO_UPDATE=1
PNPM="pnpm"

cd "$ROOT"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
step() { printf '\n\033[1;36m→ %s\033[0m\n' "$1"; }
warn() { printf '\033[33m!  %s\033[0m\n' "$1"; }
ok()   { printf '\n\033[1;32m✓  %s\033[0m\n' "$1"; }
die()  { printf '\033[31m✗  %s\033[0m\n' "$1" >&2; exit 1; }

usage() {
  cat <<'USAGE'
Usage: ./setup.sh <create|theme|join> [--yes] [--no-update]

  create       Rename the project, point the scripts at your store, reset git,
               install, then optionally create the theme on the store.
  theme        Build and push a new unpublished theme, then write its id
               in the package.json scripts. Safe to re-run.
  join         Install an existing project (checks node, pnpm and the CLI).

  --yes        Accept every default instead of prompting.
  --no-update  Skip the `pnpm update` that follows the install.

Environment defaults: PROJECT_NAME, PACKAGE_NAME, STORE, STORE_PASSWORD,
THEME_NAME, THEME_ID.
USAGE
  exit 1
}

# ask VAR_NAME "Question" "default"
ask() {
  local var="$1" question="$2" default="$3" preset answer
  eval "preset=\${$var:-}"
  if [ -n "$preset" ]; then default="$preset"; fi
  if [ "$ASSUME_YES" = 1 ] || [ -n "$preset" ]; then
    eval "$var=\$default"
    printf '   %s: %s\n' "$question" "$default"
    return
  fi
  read -r -p "   $question [$default]: " answer || true
  eval "$var=\${answer:-\$default}"
}

confirm() {
  local answer
  if [ "$ASSUME_YES" = 1 ]; then return 0; fi
  read -r -p "   $1 [y/N]: " answer || true
  case "$answer" in [yY]*) return 0 ;; *) return 1 ;; esac
}

slugify() {
  node -e '
    process.stdout.write(
      process.argv[1]
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
  ' "$1"
}

# Reads a `--flag=value` used in the package.json scripts (first match).
read_script_flag() {
  node -e '
    const [file, flag] = process.argv.slice(1)
    const pkg = JSON.parse(require("fs").readFileSync(file, "utf8"))
    const re = new RegExp(`--${flag}=("[^"]*"|\\S+)`)
    for (const cmd of Object.values(pkg.scripts)) {
      const hit = cmd.match(re)
      if (hit) { process.stdout.write(hit[1].replace(/"/g, "")); break }
    }
  ' "$PKG" "$1"
}

# Rewrites every `--flag=value` in the package.json scripts. Empty value drops the flag.
set_script_flag() {
  node -e '
    const fs = require("fs")
    const [file, flag, value] = process.argv.slice(1)
    const pkg = JSON.parse(fs.readFileSync(file, "utf8"))
    const re = new RegExp(`\\s?--${flag}=("[^"]*"|\\S+)`, "g")
    for (const [name, cmd] of Object.entries(pkg.scripts)) {
      pkg.scripts[name] = cmd.replace(re, value ? ` --${flag}=${value}` : "")
    }
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n")
  ' "$PKG" "$1" "$2"
}

# set_pkg_field KEY VALUE (top-level string field)
set_pkg_field() {
  node -e '
    const fs = require("fs")
    const [file, key, value] = process.argv.slice(1)
    const pkg = JSON.parse(fs.readFileSync(file, "utf8"))
    pkg[key] = value
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n")
  ' "$PKG" "$1" "$2"
}

pkg_field() {
  node -p "require('$PKG').$1 ?? ''"
}

pnpm_major() { "$1" -v 2>/dev/null | cut -d. -f1; }

# The lockfile and node_modules come from pnpm 11: another major fails with
# ERR_PNPM_UNEXPECTED_STORE. Falls back on $PNPM_HOME when an older pnpm is first in PATH.
require_tools() {
  command -v node >/dev/null || die "node is required"
  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  [ "$major" -ge 22 ] || die "node >= 22.12 is required, found $(node -v)"

  if [ "$(pnpm_major pnpm)" = 11 ]; then
    PNPM="pnpm"
  elif [ -x "${PNPM_HOME:-$HOME/Library/pnpm}/pnpm" ] \
    && [ "$(pnpm_major "${PNPM_HOME:-$HOME/Library/pnpm}/pnpm")" = 11 ]; then
    PNPM="${PNPM_HOME:-$HOME/Library/pnpm}/pnpm"
    warn "pnpm in PATH is not v11, using $PNPM"
  else
    die "pnpm 11 is required (found $(pnpm -v 2>/dev/null || echo none)) — https://pnpm.io/installation"
  fi

  command -v shopify >/dev/null || die "Shopify CLI is required — https://shopify.dev/docs/api/shopify-cli"
  printf '   node %s, pnpm %s, shopify %s\n' "$(node -v)" "$("$PNPM" -v)" "$(shopify version 2>/dev/null)"
}

install_deps() {
  step "Installing dependencies"
  "$PNPM" install
  if [ "$DO_UPDATE" = 1 ]; then
    step "Updating dependencies within their semver ranges"
    "$PNPM" update
    printf '   Majors stay manual — run `pnpm outdated` then `pnpm update --latest <pkg>`.\n'
  fi
}

# Drops the starter history when the copy still comes from the starter repo
# (git clone). A degit copy has no .git, a GitHub template has its own origin.
reset_git() {
  step "Git"
  local origin=""
  if [ -d .git ]; then
    origin="$(git remote get-url origin 2>/dev/null || true)"
    case "$origin" in
      *"$STARTER_REPO"*)
        if confirm "This copy still points at the starter ($origin). Drop its history?"; then
          rm -rf .git
        else
          warn "Kept the starter history. Remove the origin before pushing anywhere."
          return
        fi
        ;;
      *)
        printf '   Keeping the existing repository (%s).\n' "${origin:-no origin}"
        return
        ;;
    esac
  fi
  git init -q -b main
  printf '   New repository on main.\n'
}

# Builds first: snippets/vite-tag.liquid is git-ignored, the layout breaks without it.
create_theme() {
  local store="$1" name="$2" out theme_id
  step "Building the assets"
  "$PNPM" build

  step "Creating the unpublished theme \"$name\" on $store"
  printf '   The Shopify CLI opens the browser if you are not logged in.\n'
  out="$(shopify theme push --store="$store" --unpublished --theme="$name" --json)" \
    || die "shopify theme push failed"
  theme_id="$(printf '%s' "$out" | node -e '
    const raw = require("fs").readFileSync(0, "utf8")
    const hit = raw.match(/"id"\s*:\s*(\d+)/)
    if (!hit) process.exit(1)
    process.stdout.write(hit[1])
  ')" || die "Could not read the theme id from: $out"

  set_script_flag theme "$theme_id"
  printf '   Theme id %s written in the package.json scripts.\n' "$theme_id"
  THEME_ID="$theme_id"
}

done_message() {
  ok "$1"
  shift
  while [ $# -ge 2 ]; do
    printf '   %-14s %s\n' "$1" "$2"
    shift 2
  done
  cat <<'NEXT'

   Start the dev servers:

     pnpm dev       # Vite (3000) + Shopify CLI (9292, open this one)

   Still to do by hand:
     - favicons in assets/ (see snippets/meta-favicons.liquid)
     - replace the demo content: config/settings_data.json, templates/, sections/rich-text.liquid
     - README title and credits
     - run /refresh-architecture in Claude Code to generate CLAUDE.md
NEXT
}

cmd_create() {
  bold "JCS Shopify starter — new project"
  require_tools

  local starter_version current_store
  starter_version="$(pkg_field version)"
  current_store="$(read_script_flag store)"

  step "Project details"
  ask PROJECT_NAME "Project name" "My Project"
  ask PACKAGE_NAME "package.json name" "$(slugify "$PROJECT_NAME")"
  ask STORE "Store domain (xxx.myshopify.com)" "$current_store"
  case "$STORE" in *.myshopify.com) ;; *) STORE="$STORE.myshopify.com" ;; esac
  ask STORE_PASSWORD "Storefront password (blank = none)" ""

  step "Patching package.json"
  set_pkg_field name "$PACKAGE_NAME"
  set_pkg_field description "$PROJECT_NAME — Shopify theme"
  set_pkg_field version "0.1.0"
  set_script_flag store "$STORE"
  set_script_flag store-password "$STORE_PASSWORD"
  printf '   name %s, store %s\n' "$PACKAGE_NAME" "$STORE"

  reset_git
  install_deps

  THEME_ID="${THEME_ID:-}"
  if [ -n "$THEME_ID" ]; then
    set_script_flag theme "$THEME_ID"
    printf '   Using the existing theme %s.\n' "$THEME_ID"
  elif confirm "Create an unpublished theme on $STORE now?"; then
    ask THEME_NAME "Theme name" "$PROJECT_NAME — dev"
    create_theme "$STORE" "$THEME_NAME"
  else
    warn "The scripts still target theme $(read_script_flag theme) — run ./setup.sh theme later."
  fi

  # A repository made with "Use this template" already has a first commit
  if [ -z "$(git rev-parse --verify -q HEAD 2>/dev/null)" ]; then
    if confirm "Create the initial commit?"; then
      git add -A
      git commit -q -m "Initial commit from jcs-shopify-starter-theme v$starter_version"
      printf '   Initial commit created.\n'
    fi
  elif [ -n "$(git status --porcelain)" ] && confirm "Commit the setup changes?"; then
    git add -A
    git commit -q -m "chore: set up project from jcs-shopify-starter-theme v$starter_version"
    printf '   Setup committed. Push it with git push.\n'
  fi

  done_message "$PROJECT_NAME is ready." \
    "Starter" "v$starter_version" \
    "Package" "$PACKAGE_NAME" \
    "Store" "$STORE" \
    "Theme id" "${THEME_ID:-not created yet (./setup.sh theme)}"
}

cmd_theme() {
  bold "JCS Shopify starter — new theme on the store"
  require_tools
  [ -d node_modules ] || install_deps

  step "Theme details"
  ask STORE "Store domain (xxx.myshopify.com)" "$(read_script_flag store)"
  case "$STORE" in *.myshopify.com) ;; *) STORE="$STORE.myshopify.com" ;; esac
  ask THEME_NAME "Theme name" "$(pkg_field name) — dev"
  set_script_flag store "$STORE"
  create_theme "$STORE" "$THEME_NAME"

  ok "Theme $THEME_ID created on $STORE and wired in package.json."
}

cmd_join() {
  bold "JCS Shopify starter — local environment"
  require_tools
  install_deps
  done_message "Local environment ready." \
    "Store" "$(read_script_flag store)" \
    "Theme id" "$(read_script_flag theme)"
}

MODE="${1:-}"
if [ $# -gt 0 ]; then shift; fi
for arg in "$@"; do
  case "$arg" in
    --yes|-y) ASSUME_YES=1 ;;
    --no-update) DO_UPDATE=0 ;;
    *) usage ;;
  esac
done

case "$MODE" in
  create) cmd_create ;;
  theme)  cmd_theme ;;
  join)   cmd_join ;;
  *)      usage ;;
esac
