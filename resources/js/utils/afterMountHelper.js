import { piecesManager } from 'piecesjs';

export function triggerAfterMount(context = document.body) {
  Object.keys(piecesManager.currentPieces).forEach((name) => {
    Object.keys(piecesManager.currentPieces[name]).forEach((id) => {
      if (
        typeof piecesManager.currentPieces[name][id].piece.afterMount !=
          'undefined' &&
        typeof piecesManager.currentPieces[name][id].piece.afterMount ==
          'function'
      ) {
        let piece = piecesManager.currentPieces[name][id].piece;
        if (context.contains(piece)) {
          piece.afterMount();
        }
      }
    });
  });
}
