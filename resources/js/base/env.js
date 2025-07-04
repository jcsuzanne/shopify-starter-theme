'use strict';

let env = {
  $window: window,
  $html: document.getElementsByTagName('html')[0],
  $body: document.body,
  $master: document.getElementById('master'),
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
