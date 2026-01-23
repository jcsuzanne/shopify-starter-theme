import { load } from 'piecesjs';
import { updateComponents } from './components.js';

import './alpine/start.js';

// Import CSS to bundle it
import '../css/main.css';

load('c-app', () => import('/resources/js/components/App.js'));
updateComponents(document);
