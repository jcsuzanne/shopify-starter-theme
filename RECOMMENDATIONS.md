# Recommandations de Modernisation - JCS Starter Theme

## 📊 Analyse du Projet Actuel

### Points Forts ✅
- **Vite 7.0.2** : Build tool moderne et performant
- **Tailwind CSS v4.1.16** : Framework CSS à la pointe
- **pnpm** : Gestionnaire de paquets moderne et efficace
- **Pieces.js** : Framework custom bien intégré
- Architecture modulaire et bien organisée

---

## 🚀 Recommandations Prioritaires

### 1. **Mise à Jour des Dépendances Principales**

#### GSAP (Animations)
- **Actuel** : `3.13.0`
- **Recommandé** : `3.14.2` (dernière version)
- **Avantage** : GSAP est maintenant **100% gratuit** (y compris tous les plugins premium comme SplitText et MorphSVG) depuis la version 3.13
- **Action** : `pnpm update gsap@latest`

#### Lenis (Smooth Scroll)
- **Actuel** : `1.3.4`
- **Recommandé** : `1.3.15` (dernière version)
- **Avantage** : Corrections de bugs récentes, meilleure gestion du scroll horizontal
- **Action** : `pnpm update lenis@latest`

#### Swup (Navigation)
- **Actuel** : `*` (wildcard, version indéterminée)
- **Recommandé** : `4.8.2` (Swup 4)
- **⚠️ IMPORTANT** : Swup 4 contient des breaking changes majeurs
- **Nouvelles fonctionnalités** :
  - Support natif des View Transitions API
  - Gestion du scroll intégrée
  - Système de hooks amélioré
  - Meilleure gestion du cache
- **Action** : Migration nécessaire (voir section dédiée)

---

### 2. **Optimisation PostCSS avec Tailwind v4**

⚠️ **IMPORTANT** : Votre projet utilise `@tailwindcss/vite` dans `vite.config.js`. Avec ce plugin, Tailwind gère automatiquement `@import` et l'autoprefixing pour les fichiers CSS qui importent Tailwind.

Cependant, Vite peut toujours utiliser `postcss.config.js` pour traiter d'autres fichiers CSS. Voici ce qu'il faut savoir :

#### Analyse de votre configuration actuelle

**Dans `postcss.config.js`** :
- `postcss-import` : Utilisé pour résoudre les `@import` dans les fichiers CSS
- `autoprefixer` : Utilisé pour ajouter les préfixes vendeurs

**Dans `package.json`** :
- Beaucoup de plugins PostCSS sont listés mais **ne sont pas utilisés** dans `postcss.config.js`
- Ces plugins pourraient être des dépendances inutilisées ou utilisées ailleurs

#### Recommandations PostCSS

**Option 1 : Simplifier `postcss.config.js` (Recommandé si tous vos CSS passent par Tailwind)**

Puisque vous utilisez `@tailwindcss/vite` et que tous vos fichiers CSS importent Tailwind (via `main.css`), vous pouvez simplifier :

```js
import postcssComment from 'postcss-comment';

export default ({ env }) => ({
  parser: postcssComment,
  plugins: [
    // Le plugin Vite de Tailwind gère déjà @import et autoprefixer
    // Si vous avez besoin d'autres plugins spécifiques, ajoutez-les ici
  ],
});
```

**Option 2 : Conserver la configuration actuelle (Si vous avez des fichiers CSS standalone)**

Si vous avez des fichiers CSS qui ne passent pas par Tailwind, conservez `postcss-import` et `autoprefixer` dans `postcss.config.js`.

#### Plugins PostCSS dans `package.json` à vérifier

Ces plugins sont listés mais **ne semblent pas être utilisés** dans `postcss.config.js` :
- `postcss-calc`, `postcss-pxtorem`, `postcss-flexbugs-fixes`
- `postcss-conditionals`, `postcss-for`, `postcss-extend-rule`
- `postcss-custom-media`, `postcss-mixins`, `postcss-nested`, `postcss-simple-vars`
- `postcss-utilities`

**Action recommandée** : Vérifier avec `pnpm why <package>` si ces plugins sont vraiment nécessaires. Si non, les supprimer pour réduire la taille de `node_modules`.

**Note sur `postcss-custom-media`** : Votre projet utilise `@custom-media` dans `tailwind-config.css`. Tailwind v4 supporte nativement `@custom-media`, donc ce plugin pourrait ne plus être nécessaire si vous utilisez uniquement le plugin Vite.

---

### 3. **Remplacement de Dépendances Obsolètes**

#### axios → Fetch API natif
- **Actuel** : `axios@^1.10.0` (utilisé dans `resources/js/shopify/CartEvents.js`)
- **Recommandé** : Utiliser `fetch()` natif (déjà disponible dans tous les navigateurs modernes depuis 2015)
- **Avantage** :
  - Réduction de la taille du bundle (~13KB)
  - Pas de dépendance externe
  - API moderne et standardisée
- **⚠️ Action requise** :
  - Remplacer les appels axios dans `CartEvents.js` (fonctions `AddToCart` et `UpdateCart`)
  - Créer un wrapper `fetch` si nécessaire pour maintenir la même API
  - Tester que les erreurs sont correctement gérées (fetch ne rejette pas les erreurs HTTP comme axios)

#### mobile-detect → User-Agent Detection moderne
- **Actuel** : `mobile-detect@^1.4.5`
- **Recommandé** : Utiliser `navigator.userAgentData` (User-Agent Client Hints API) ou une librairie moderne comme `ua-parser-js`
- **Avantage** :
  - API moderne et plus précise
  - Meilleure performance
  - Support des appareils récents
- **Alternative** : `@tarekraafat/autocomplete.js` ou `bowser`

#### events → EventTarget natif
- **Actuel** : `events@^3.3.0`
- **Recommandé** : Utiliser `EventTarget` natif ou `mitt` (plus léger)
- **Avantage** : Réduction de la taille du bundle

---

### 4. **Alignement des Versions Node.js**

- **`.nvmrc`** : `v20.6.1` ✅
- **`package.json`** : `>=14.17` ❌

**Recommandation** : Aligner `package.json` avec `.nvmrc`
```json
"engines": {
  "node": ">=20.6.1",
  "npm": ">=10.0"
}
```

**Avantage** : Cohérence dans l'équipe, utilisation des fonctionnalités Node.js modernes.

---

### 5. **Optimisation Alpine.js**

- **Actuel** : `alpinejs@^3.14.9`
- **Recommandé** : `3.15.3` (dernière version stable)
- **Avantage** : Améliorations de l'évaluateur, corrections pour ShadowRoot
- **Action** : `pnpm update alpinejs@latest`
- **Alternative** : Si Alpine n'est utilisé que pour quelques interactions simples, considérer :
  - Vanilla JS avec Pieces.js (déjà présent)
  - Réduire l'utilisation d'Alpine au strict minimum

### 7. **Mise à Jour Vite**

- **Actuel** : `vite@^7.0.2`
- **Recommandé** : `7.3.x` (dernière version stable)
- **Avantage** : Corrections de bugs et améliorations de performance
- **Action** : `pnpm update vite@latest`

---

### 6. **Mise à Jour Vite**

- **Actuel** : `vite@^7.0.2`
- **Recommandé** : `7.3.x` (dernière version stable)
- **Avantage** : Corrections de bugs et améliorations de performance
- **Action** : `pnpm update vite@latest`

---

### 7. **Dépendances Dev à Nettoyer**

#### Dépendances potentiellement inutilisées :
- `postcss-cli` → Probablement inutilisé (Vite gère PostCSS)
- `concat` → Vérifier si utilisé
- `path` → Module Node natif, ne devrait pas être dans dependencies

**Action** : Auditer avec `pnpm why <package>` pour chaque dépendance.

---

## 📦 Plan d'Action Recommandé

### Phase 1 : Mises à jour simples (Sans breaking changes)
1. ✅ Mettre à jour GSAP → `3.14.2`
2. ✅ Mettre à jour Lenis → `1.3.15`
3. ✅ Mettre à jour Alpine.js → `3.15.3`
4. ✅ Mettre à jour Vite → `7.3.x`
5. ✅ Aligner versions Node.js
6. ✅ Nettoyer dépendances inutilisées

### Phase 2 : Optimisations PostCSS
1. ✅ Supprimer `postcss-import`, `autoprefixer`, `postcss-nested`
2. ✅ Simplifier `postcss.config.js`
3. ✅ Tester que tout fonctionne correctement

### Phase 3 : Remplacements de dépendances
1. ⚠️ Remplacer `axios` par `fetch` natif
2. ⚠️ Remplacer `mobile-detect` par solution moderne
3. ⚠️ Remplacer `events` si nécessaire

### Phase 4 : Migration Swup 4 (Requiert du temps)
1. ⚠️ Lire la documentation de migration Swup 4
2. ⚠️ Tester en environnement de développement
3. ⚠️ Adapter le code existant aux nouvelles APIs

---

## 🔧 Commandes Utiles

```bash
# Mise à jour des dépendances (une par une pour éviter les conflits)
pnpm update gsap@latest
pnpm update lenis@latest
pnpm update alpinejs@latest
pnpm update vite@latest

# Vérifier les dépendances inutilisées
pnpm why <package-name>

# Auditer les vulnérabilités
pnpm audit

# Vérifier les versions obsolètes
pnpm outdated

# Vérifier la version actuelle installée d'un package
pnpm list <package-name>

# Tester si un build fonctionne après modifications
pnpm build
```

---

## 📈 Bénéfices Attendus

- **Réduction de la taille du bundle** : ~20-30KB (suppression axios, optimisation PostCSS)
- **Meilleures performances** : Tailwind v4 + Vite 7 = build plus rapide
- **Maintenance facilitée** : Moins de dépendances = moins de vulnérabilités
- **Code plus moderne** : Utilisation des APIs natives du navigateur
- **Meilleure compatibilité** : Swup 4 avec View Transitions API

---

## ⚠️ Points d'Attention et Vérifications Nécessaires

### Avant d'appliquer les recommandations PostCSS :

1. **Tester sans `postcss-import` et `autoprefixer`** :
   - Créer une branche de test
   - Simplifier `postcss.config.js` comme recommandé
   - Vérifier que tous les fichiers CSS sont correctement traités
   - Vérifier que l'autoprefixing fonctionne toujours

2. **Vérifier les plugins PostCSS inutilisés** :
   ```bash
   # Pour chaque plugin listé dans package.json mais non utilisé dans postcss.config.js
   pnpm why postcss-calc
   pnpm why postcss-pxtorem
   # etc.
   ```
   Si ces plugins ne sont pas utilisés, ils peuvent être supprimés.

### Autres points d'attention :

1. **Swup 4** : Migration majeure avec breaking changes, prévoir du temps de test
2. **Tailwind v4** : Vérifier que tous les plugins PostCSS personnalisés sont compatibles
3. **Fetch API** : S'assurer que tous les navigateurs cibles supportent `fetch()` (déjà largement supporté depuis 2015)
4. **Tests** : Tester chaque changement dans un environnement de staging avant production
5. **axios** : Vérifier tous les usages d'axios dans le projet avant de remplacer par fetch (actuellement utilisé dans `CartEvents.js`)

---

## 💡 Exemples de Code pour les Remplacements

### Remplacer axios par fetch natif

**Avant** (avec axios) :
```js
import axios from 'axios';

const response = await axios.get('/api/endpoint', {
  headers: { 'Content-Type': 'application/json' }
});
```

**Après** (avec fetch natif) :
```js
const response = await fetch('/api/endpoint', {
  headers: { 'Content-Type': 'application/json' }
});
const data = await response.json();
```

**Wrapper fetch pour compatibilité axios** (si nécessaire) :
```js
// utils/fetch.js
export const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
```

### Remplacer mobile-detect

**Avant** :
```js
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(navigator.userAgent);
const isMobile = md.mobile() !== null;
```

**Après** (avec User-Agent Client Hints API) :
```js
// utils/device.js
export const isMobile = () => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }
  // Fallback pour navigateurs plus anciens
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
```

---

## 📚 Ressources

- [GSAP 3.13 Release Notes](https://gsap.com/blog/3-13/)
- [Swup 4 Migration Guide](https://swup.js.org/announcements/swup-4)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [User-Agent Client Hints API](https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API)

---

*Rapport généré le 23 janvier 2025*
