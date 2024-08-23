import { load } from 'piecesjs';
import { updateComponents } from './components.js';

import './alpine/start.js';

load('c-app', () => import('/resources/js/components/App.js'));
load('c-transitions', () => import('/resources/js/components/Transitions.js'));
updateComponents(document);
