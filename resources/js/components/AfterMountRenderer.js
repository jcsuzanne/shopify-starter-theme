import { Piece } from 'piecesjs';
import { piecesManager } from 'piecesjs';

export function renderComponents() {
  Object.keys(piecesManager.currentPieces).forEach((name) => {
    Object.keys(piecesManager.currentPieces[name]).forEach((id) => {
      if (
        typeof piecesManager.currentPieces[name][id].piece.afterMount !=
          'undefined' &&
        typeof piecesManager.currentPieces[name][id].piece.afterMount ==
          'function'
      ) {
        let piece = piecesManager.currentPieces[name][id].piece;
        piece.afterMount();
      }
    });
  });
}
