# Analyse des Dépendances - Package.json

## ✅ Dépendances UTILISÉES (à conserver)

### Dependencies
- ✅ `gsap` - Utilisé dans plusieurs composants (App.js, CartEvents.js, Scroll.js, etc.)
- ✅ `lenis` - Utilisé dans Scroll.js
- ✅ `piecesjs` - Framework principal utilisé partout
- ✅ `swup` - Utilisé dans Transitions.js
- ✅ `@swup/preload-plugin` - Utilisé dans Transitions.js
- ✅ `@swup/scroll-plugin` - Utilisé dans Transitions.js
- ✅ `@swup/progress-plugin` - Utilisé dans Transitions.js

### DevDependencies
- ✅ `@by-association-only/vite-plugin-shopify-clean` - Utilisé dans vite.config.js
- ✅ `@shopify/prettier-plugin-liquid` - Utilisé dans .prettierrc.json
- ✅ `@tailwindcss/vite` - Utilisé dans vite.config.js
- ✅ `@vitejs/plugin-basic-ssl` - Utilisé dans vite.config.js
- ✅ `alpinejs` - Utilisé dans alpine/start.js
- ✅ `concurrently` - Utilisé dans script "dev"
- ✅ `currency.js` - Utilisé dans shopify/Helpers.js
- ✅ `events` - Utilisé dans base/channels.js (EventsEmitter)
- ✅ `mobile-detect` - Utilisé dans base/detection.js
- ✅ `postcss` - Nécessaire pour postcss.config.js
- ✅ `postcss-comment` - Utilisé dans postcss.config.js (parser)
- ✅ `prettier` - Utilisé pour le formatage
- ✅ `prettier-plugin-tailwindcss` - Utilisé dans .prettierrc.json
- ✅ `tailwindcss` - Framework CSS principal
- ✅ `vite` - Build tool principal
- ✅ `vite-plugin-page-reload` - Utilisé dans vite.config.js
- ✅ `vite-plugin-shopify` - Utilisé dans vite.config.js

---

## ❌ Dépendances NON UTILISÉES (à supprimer)

### Dependencies
- ❌ `@swup/fade-theme` - **PAS UTILISÉ** dans le code
- ❌ `@swup/parallel-plugin` - **PAS UTILISÉ** dans le code

### DevDependencies
- ❌ `@splidejs/splide` - **PAS UTILISÉ** dans le code JS
- ❌ `@swup/fragment-plugin` - **PAS UTILISÉ** dans le code
- ❌ `@tailwindcss/postcss` - **PAS UTILISÉ** (vous utilisez @tailwindcss/vite)
- ❌ `concat` - **PAS UTILISÉ** dans le code
- ❌ `cssnano` - **PAS UTILISÉ** (Vite gère la minification)
- ❌ `@csstools/postcss-global-data` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `path` - **Module Node natif**, ne devrait pas être dans dependencies
- ❌ `postcss-cli` - **PAS UTILISÉ** (Vite gère PostCSS)
- ❌ `postcss-calc` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-conditionals` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-custom-media` - **PAS UTILISÉ** dans postcss.config.js (Tailwind v4 gère @custom-media nativement)
- ❌ `postcss-extend-rule` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-flexbugs-fixes` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-for` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-mixins` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-nested` - **PAS UTILISÉ** dans postcss.config.js (Tailwind v4 gère le nesting nativement)
- ❌ `postcss-pxtorem` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-simple-vars` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `postcss-utilities` - **PAS UTILISÉ** dans postcss.config.js
- ❌ `tailwind-clip-path` - **À VÉRIFIER** (peut être utilisé via Tailwind config)

---

## ⚠️ Dépendances À VÉRIFIER

- `tailwind-clip-path` - Vérifier si utilisé dans la config Tailwind ou dans les classes CSS
- `autoprefixer` - Gardé pour l'instant mais pourrait être supprimé (Tailwind v4 le gère)

---

## 📊 Résumé

**Total dépendances analysées** : 50
- ✅ **Utilisées** : ~25
- ❌ **Non utilisées** : ~23
- ⚠️ **À vérifier** : 2

**Économie potentielle** : Suppression de ~23 dépendances non utilisées réduirait significativement la taille de `node_modules` et accélérerait les installations.

---

## 🔧 Recommandations

1. **Supprimer immédiatement** les dépendances clairement non utilisées
2. **Vérifier** `tailwind-clip-path` dans la config Tailwind avant de supprimer
3. **Garder** `autoprefixer` temporairement pour éviter les régressions, puis tester sa suppression
4. **Tester** après chaque suppression pour s'assurer qu'aucune dépendance transitive n'est cassée
