import {
  loadPiece,
  loadGlobalComponents,
  updateComponents,
} from './components.js';

import './alpine/start.js';

// Build: CSS bundled with the entry (render-blocking <link> from vite-tag).
// Dev: linked by vite-tag ('/resources/css/main.css'), not injected by JS, so no unstyled flash.
if (!import.meta.env.DEV) import('../css/main.css');

loadPiece('c-app', () => import('/resources/js/components/App.js'))
  // Container Pieces read window.isMobile, set by initDevice() in App's mount
  .then(() =>
    Promise.all([
      // Layout shell (ui, password…): once. Swup container: replayed by Transitions on each visit
      loadGlobalComponents(),
      updateComponents(document),
    ]),
  )
  .then(() => document.dispatchEvent(new CustomEvent('pieces:ready')));
