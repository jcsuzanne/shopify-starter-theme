import { load } from 'piecesjs';
import { updateComponents } from './components.js';

import './alpine/start.js';

// Import CSS to bundle it
import '../css/main.css';
import '../css/tailwind-config.css';
import '../css/utilities/utilities.css';
// import '../css/common/animations.css';
import '../css/common/fonts.css';
import '../css/common/layout.css';

load('c-app', () => import('/resources/js/components/App.js'));
load('c-transitions', () => import('/resources/js/components/Transitions.js'));
updateComponents(document);
