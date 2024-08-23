import { Piece } from 'piecesjs';

export class Header extends Piece {
  constructor() {
    super('Header', {
      stylesheets: [() => import('/resources/css/components/header.css')],
    });
  }
}

// Register the custom element
customElements.define('c-header', Header);
