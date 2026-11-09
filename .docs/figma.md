# Figma — {Nom du projet}

Fichier : `{file key}` ({nom du fichier Figma}).
Page de référence : `{node id}` « {nom de la page} ». Proto : page `{node id}` (optionnel).
Analyse : {AAAA-MM-JJ}.

> Modèle du starter. Remplir le file key et la page de référence, puis lancer `/forge-design-foundations check`. Les tableaux et la section « Écarts relevés » sont remplis par `/forge-design-foundations update` après validation.

## Écrans (desktop {largeur} / mobile {largeur})

| Code | Écran | Node desktop | Node mobile |
|---|---|---|---|
| | | | |

## Modules réutilisables

Pages ou boards où mesurer les paddings de module (`section`) :

| Module | Node | Notes |
|---|---|---|
| | | |

## Grille

| | Largeur | Colonnes | Largeur colonne | Gouttière | Marge |
|---|---|---|---|---|---|
| Desktop | | | | | |
| Mobile | | | | | |

Breakpoint entre les styles desktop et mobile : 1024 (`lg`), sauf décision contraire.

## Typo

Familles : {famille (graisses / styles)}.
Suffixes des styles Figma : `{M}` = desktop (`lg:`), `{XS}` = mobile (base).

| Style | Famille | Desktop | Mobile | Casse / déco | Token taille | Utilitaire |
|---|---|---|---|---|---|---|
| | | | | | | |

## Couleurs

| Style / variable | Hex | Token |
|---|---|---|
| | | |

## Espacements

Mesurés ou issus des variables Figma.

| Token | Mobile | Desktop | Source |
|---|---|---|---|
| margin | | | marge de la grille |
| gutter | | | gouttière de la grille |
| section | | | padding haut / bas des modules |

Échelle (`--spacing-*`) :

| Token | Valeur |
|---|---|
| | |

## Convention de tokens

Pas d'override des noms Tailwind par défaut (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`…), jamais de reset de namespace avec `initial`.

Paliers en mots, du plus petit au plus grand : `tiny`, `small`, `medium`, `large`, `huge`, `giant`, `display`, `monument`. Variantes `-minus` / `-plus` autour d'une base :

- 1 valeur dans le palier : la base seule (`giant`) ;
- 2 valeurs : la base est la plus petite (`tiny` / `tiny-plus`) ;
- 3 valeurs : la base est celle du milieu (`medium-minus` / `medium` / `medium-plus`) ;
- jamais plus de 3 valeurs par palier : au-delà, ouvrir le palier suivant.

La même règle s'applique aux tailles (`--text-*`) et aux espacements (`--spacing-*`), chacun avec sa propre échelle.

Polices : `--font-sans`, `--font-serif`, et une troisième famille nommée selon son rôle (`--font-script`, `--font-mono`…).

Utilitaires de texte : un `u-*` par style Figma dans `resources/css/common/typography.css`. Il porte la famille, la graisse, l'italique, la casse, le soulignement, l'interlettrage, la taille et l'interlignage du style. Pas de classe ajoutée à la main dans le markup pour compléter un style.

Breakpoints : mobile-first avec les variants Tailwind (`md:`, `lg:`), jamais de `@media` brut en px. Style mobile = base, style desktop = `lg:`.

Tokens de mise en page responsive `margin`, `gutter`, `section` : valeur mobile dans `@theme`, valeur desktop dans `:root { @variant lg { … } }`. Ils alimentent `u-px-layout`, `u-grid-layout` et `u-py-module` / `u-pt-module` / `u-pb-module`.

## Décisions

| Date | Sujet | Décision |
|---|---|---|
| | | |

Snapshot validé : `.docs/figma-tokens.json`. Prompt du plugin : `figma-plugin-prompt.md`. Sync : `/forge-design-foundations check|update`.

## Écarts relevés (dernière sync : {AAAA-MM-JJ}, {source})

- Styles ambigus (plusieurs tailles mobiles, suffixes manquants) :
- Textes sans style (à remonter au designer) :
- Valeurs d'espacement hors échelle :
- Autres écarts maquette / code :
