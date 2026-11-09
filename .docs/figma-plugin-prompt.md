# Prompt du plugin Figma « Design tokens snapshot »

À coller tel quel dans le générateur de plugin Figma. Le plugin ne fait aucune interprétation : il exporte les valeurs brutes, la correspondance vers les tokens du code se fait côté repo (voir `figma.md` et `/forge-design-foundations`).

```
Crée un plugin Figma Design nommé « Design tokens snapshot ».

Description :
« Exports text styles, color styles, variables and layout grids as raw JSON, with a visual reference frame ».

Respecte précisément les comportements ci-dessous. N'ajoute ni options, ni fonctionnalités supplémentaires, ni redesign.

LANCEMENT

Le plugin démarre automatiquement à l'ouverture, sans sélection nécessaire et sans paramètres.

Interface de 280 × 120 px :
- composants fig-content et fig-group ;
- groupe « Info » ;
- message « Generating design tokens snapshot... » ;
- fallback localStorage en mémoire lorsque localStorage est inaccessible.

Utilise le chargement dynamique des pages et charge la page courante avant de générer le résultat. Utilise les méthodes asynchrones pour lire les ressources locales (getLocalTextStylesAsync, getLocalPaintStylesAsync, getLocalVariableCollectionsAsync, getVariableByIdAsync, getStyleByIdAsync).

PRINCIPE

Le plugin n'interprète rien : pas de renommage, pas de kebab-case, pas de regroupement Desktop/Mobile, pas de génération de CSS ni de noms de tokens. Il exporte les valeurs Figma telles quelles.

DONNÉES

Collecte, dans leur ordre d'apparition :

1. Styles de texte locaux. Pour chacun :
   - name : nom complet du style ;
   - family : famille de police ;
   - style : style de police tel quel (ex. « Medium », « Semibold », « Italic ») ;
   - weight : graisse numérique déduite du style, sans distinction de casse ni d'espaces :
     Thin 100, ExtraLight 200, Light 300, Regular 400, Book 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800, Black 900 ;
     « Italic » seul vaut 400 ; si aucun mot ne correspond, 400 ;
   - italic : true si le style contient « Italic » ou « Oblique », sinon false ;
   - size : taille en px ;
   - lineHeight : { "unit": "PIXELS" | "PERCENT" | "AUTO", "value": nombre, ou null pour AUTO } ;
   - letterSpacing : { "unit": "PIXELS" | "PERCENT", "value": nombre } ;
   - textCase : valeur Figma (ORIGINAL, UPPER, LOWER, TITLE, SMALL_CAPS, SMALL_CAPS_FORCED) ;
   - textDecoration : valeur Figma (NONE, UNDERLINE, STRIKETHROUGH) ;
   - usage : nombre de segments de texte de la page courante qui utilisent ce style
     (utilise getStyledTextSegments(['textStyleId']) pour compter aussi les textes à styles mixtes).

2. Styles de peinture locaux. Pour chacun : name, et le premier remplissage SOLID en hex minuscule
   (#rrggbb si opaque, #rrggbbaa si l'opacité est inférieure à 1 ; canaux arrondis après multiplication par 255).
   Si le style n'a pas de remplissage SOLID, hex vaut null et type contient le type du premier remplissage.

3. Variables de toutes les collections locales. Pour chacune :
   - collection : nom de la collection ;
   - name : nom complet de la variable (groupes « / » inclus) ;
   - type : resolvedType ;
   - scopes : tableau des scopes ;
   - values : objet { nom du mode : valeur } pour tous les modes.
     COLOR → hex comme ci-dessus ; FLOAT → nombre ; STRING → chaîne ; BOOLEAN → booléen ;
     alias → { "alias": nom complet de la variable cible }. Ne résous pas les alias.

4. Grilles de mise en page des frames de premier niveau de la page courante qui possèdent au moins une grille.
   Pour chaque grille : pattern, count, gutterSize, offset, sectionSize, alignment (null si non applicable).
   Regroupe les frames dont la largeur et les grilles sont identiques : "frames" liste leurs noms.

5. Textes sans style de la page courante : tous les nœuds texte dont textStyleId est vide.
   Groupe-les par family + style + size + lineHeight et compte les occurrences.
   Ignore les textes à valeurs mixtes (figma.mixed) et compte-les à part dans meta.mixedTexts.

JSON

Construis un seul objet JSON, indenté avec 2 espaces :

{
  "meta": {
    "file": nom du fichier,
    "page": nom de la page courante,
    "generatedAt": date et heure ISO 8601,
    "counts": { "textStyles", "paintStyles", "variables", "unstyledTexts" },
    "mixedTexts": nombre
  },
  "textStyles": [ ... ],
  "paintStyles": [ { "name", "hex", "type" } ],
  "variables": [ { "collection", "name", "type", "scopes", "values" } ],
  "grids": [ { "frames": [noms], "width": nombre, "layoutGrids": [ { "pattern", "count", "gutterSize", "offset", "sectionSize", "alignment" } ] } ],
  "unstyledTexts": [ { "family", "style", "size", "lineHeight", "count" } ]
}

Tableaux vides si aucune donnée. Aucune valeur undefined : utilise null.

DOCUMENTATION SUR LE CANVAS

Crée un nouveau frame blanc nommé :
« Design Tokens — Snapshot {AAAA-MM-JJ HH:MM} ».

Largeur : 1200 px.
Marges : 40 px.
Contenu : 1120 px.
Hauteur calculée selon le contenu.
Tous les textes et formes doivent être éditables.

Charge Inter Regular, Bold et Medium avant de créer les textes.
Utilise Inter pour toute la documentation, et non les polices originales.

Disposition verticale :

1. Titre
« Design Tokens », 36 px Bold.
Espace de 8 px.
Sous-titre, 16 px, gris RGB(0.4, 0.4, 0.4) :
« Raw snapshot — {nom de la page} — {date} »
Puis 40 px d'espace.

2. Text Styles
Titre 24 px Bold, puis 20 px.
Une ligne par style, dans l'ordre d'apparition :
- séparateur 1120 × 1 px, gris RGB(0.85, 0.85, 0.85), puis 12 px ;
- nom du style, 14 px Bold ;
- description à 360 px à droite, 14 px :
  « {famille} {style} — {taille}px / {hauteur} — {textCase} — {textDecoration} — tracking {letterSpacing} — {usage} uses » ;
  hauteur : AUTO = normal, PIXELS = valeur suivie de px, PERCENT = valeur suivie de %.
  N'affiche textCase, textDecoration et tracking que s'ils diffèrent de ORIGINAL, NONE et 0.
- pas vertical de 32 px.
Ajoute 20 px après la section.

3. Colors, seulement si des styles de peinture existent
Titre 24 px Bold, puis 20 px.
Chaque ligne :
- carré 32 × 32 px, rayon 6 px, couleur avec opacité ;
- nom à 44 px à droite, 14 px Bold, décalage vertical 2 px ;
- hexadécimal dessous, 12 px gris RGB(0.5, 0.5, 0.5), décalage vertical 18 px ;
- pas vertical de 40 px.
Ajoute 20 px après la section.

4. Variables, seulement si des variables existent
Titre 24 px Bold, puis 20 px.
Une ligne par variable, 12 px :
« {collection} / {name} — {type} — {mode}: {valeur} · {mode}: {valeur} »
Pour COLOR, ajoute un carré 16 × 16 px de la couleur du premier mode, avant le texte, 8 px d'écart.
Pas vertical de 24 px.
Ajoute 20 px après la section.

5. Grids, seulement si des grilles existent
Titre 24 px Bold, puis 20 px.
Une ligne par groupe, 12 px :
« {width}px — {pattern} {count} cols, gutter {gutterSize}, offset {offset}, {alignment} — {frames} »
Pas vertical de 24 px, retour à la ligne automatique sur 1120 px.
Ajoute 20 px après la section.

6. Unstyled texts, seulement s'il y en a
Titre 24 px Bold, puis 20 px.
Une ligne par groupe, 12 px, rouge RGB(0.8, 0.2, 0.2) :
« {family} {style} — {size}px / {lineHeight} — {count}× »
Pas vertical de 24 px.
Ajoute 20 px après la section.

7. Raw data (JSON)
Séparateur, puis 10 px supplémentaires.
Titre 24 px Bold, puis 16 px.
Bloc :
- un seul nœud texte nommé « tokens.json » contenant le JSON complet ;
- texte Inter Regular 12 px, couleur RGB(0.9, 0.9, 0.9) ;
- largeur du texte 1080 px, hauteur automatique ;
- fond 1120 px de large, RGB(0.12, 0.12, 0.14), rayon 12 px ;
- padding horizontal 20 px et vertical 16 px.
Marge basse finale de 40 px.

FIN D'EXÉCUTION

Redimensionne le frame à sa hauteur finale.
Place-le à droite de tous les nœuds existants de la page, à 200 px du plus à droite, aligné sur y = 0.
Sélectionne-le et ajuste le viewport pour le montrer.

Prévois la relance depuis le document avec la commande :
« design-tokens-snapshot ».

Affiche :
« Design tokens snapshot created! »
Puis ferme le plugin.

Chaque exécution crée un nouveau frame sans remplacer les précédents.
Le plugin ne modifie aucun nœud, style ou variable existant.
Pas de bouton de copie, pas d'export externe.

TESTS

- Le texte du nœud « tokens.json » passe JSON.parse sans erreur.
- Un style « … Italic » → "italic": true, "weight": 400.
- Un style « … Semibold » → "weight": 600, "italic": false.
- Un style en majuscules → "textCase": "UPPER".
- Un style souligné → "textDecoration": "UNDERLINE".
- Une couleur à 10 % d'opacité → hex sur 8 caractères (ex. #0000001a).
- Une variable alias → { "alias": "nom cible" }, non résolue.
- Une variable à deux modes → deux entrées dans values.
- Un texte avec deux styles différents → compté dans usage pour chacun des deux styles.
- Lancement sans sélection.
- Aucun nœud existant n'est modifié.
```
