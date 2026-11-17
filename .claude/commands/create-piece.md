Create a new Piece: $ARGUMENTS

Follow the "Details" section of `.cursorrules` exactly:

- `resources/js/components/<PascalName>.js`, based on `resources/js/components/BasePiece.js`, defined as `c-<kebab-name>`
- registered in `resources/js/components.js`: in `PIECES` when rendered inside the swup container, in `GLOBAL_PIECES` when it is part of the layout shell
- `resources/css/components/<kebab-name>.css` with only `display: block`, imported in the COMPONENTS part of `resources/css/main.css`
- no comments, only the lifecycle methods

Then give a short Liquid usage example.
