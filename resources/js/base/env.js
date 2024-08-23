'use strict';

let env = {
  $window: window,
  $html: document.getElementsByTagName('html')[0],
  $mainContent: document.getElementById('barba-wrapper'),
  $body: document.body,
  $master: document.getElementById('master'),
  $mainnav: document.getElementById('nav-view'),
  $headernav: document.getElementById('js-headernav'),
  $mainTransition: document.getElementById('jsView--transition'),
  $mainTransitionProgress: document.getElementById('jsView--progress'),
  $launcher: document.getElementById('jsLauncher'),
  timingDelayFx: 0.5,
  framework: {},
  tablet: false,
  mobile: false,
  phone: false,
  desktop: false,
  ios: false,
  ie11: false,
  edge: false,
  orientation: false,
  isVisiting: false,
  isOldie: false,
  isTouch: 'ontouchstart' in window,
};

export default env;
