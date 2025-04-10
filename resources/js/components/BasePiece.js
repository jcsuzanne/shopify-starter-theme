import { Piece } from 'piecesjs';

export class View extends Piece {
  constructor() {
    super('View', {
      // stylesheets: [() => import('/assets/css/components/file.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };

    this.on('launcher::exit', document, this.afterMount);
  }

  afterMount() {}

  unmount() {
    this.off('launcher::exit', document, this.afterMount);
  }
}

// Register the custom element
customElements.define('view', View);
