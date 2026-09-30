import { loadPiece, updateComponents } from './components.js';

import './alpine/start.js';

// Import CSS to bundle it
import '../css/main.css';

const appReady = loadPiece('c-app', () =>
  import('/resources/js/components/App.js'),
);

Promise.all([
  appReady,
  // Container Pieces read window.isMobile, set by initDevice() in App's mount
  appReady.then(() => updateComponents(document)),
]).then(() => document.dispatchEvent(new CustomEvent('pieces:ready')));
