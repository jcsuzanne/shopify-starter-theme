import { Piece } from 'piecesjs';

export class BasePiece extends Piece {
  constructor() {
    super('BasePiece', {
      // stylesheets: [() => import('/assets/css/components/view.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };

    // afterMount is now automatically called with /utils/afterMountHelper.js
    // this.on('launcher::exit', document, this.afterMount);
  }

  afterMount() {}

  unmount() {
    // this.off('launcher::exit', document, this.afterMount);
  }
}

// Register the custom element
customElements.define('c-base-piece', BasePiece);
