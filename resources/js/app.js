import { loadPiece, updateComponents } from './components.js';

import './alpine/start.js';

// Build: CSS bundled with the entry (render-blocking <link> from vite-tag).
// Dev: linked by vite-tag ('/resources/css/main.css'), not injected by JS, so no unstyled flash.
if (!import.meta.env.DEV) import('../css/main.css');

loadPiece('c-app', () => import('/resources/js/components/App.js'))
  // Container Pieces read window.isMobile, set by initDevice() in App's mount
  .then(() =>
    Promise.all([
      updateComponents(document),
      // Page transitions (swup) are opt-in: uncomment to enable them on a project
      // loadPiece('c-transitions', () =>
      //   import('/resources/js/components/Transitions.js'),
      // ),
    ]),
  )
  .then(() => document.dispatchEvent(new CustomEvent('pieces:ready')));
