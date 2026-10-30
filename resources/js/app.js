import { loadPiece, updateComponents } from './components.js';

import './alpine/start.js';

// Import CSS to bundle it
import '../css/main.css';

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
