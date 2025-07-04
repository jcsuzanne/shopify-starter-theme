import { piecesManager } from 'piecesjs';

export function captureTree(el) {
  const capture = el.querySelectorAll('[data-dom]');
  let allDOM = {};
  for (let dom of capture) {
    const domAttr = dom.getAttribute('data-dom');
    if (typeof allDOM[domAttr] == 'undefined') {
      allDOM[domAttr] = [];
    }
    allDOM[domAttr].push(dom);
  }
  return allDOM;
}

export function scrollUpdate() {
  if (
    typeof piecesManager.currentPieces.Scroll != 'undefined' &&
    typeof piecesManager.currentPieces.Scroll.main != 'undefined'
  ) {
    console.log('scroll is updated');
    piecesManager.currentPieces.Scroll.main.piece.update();
  }
}

export function getViewport() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    outerWidth: window.innerWidth,
    outerHeight: window.innerHeight,
  };
}

export function getCoords(el) {
  return el.getBoundingClientRect();
}

export function getCssData(el, attr) {
  return window.getComputedStyle(el)[attr];
}

// Map number x from range [a, b] to [c, d]
export function map(x, a, b, c, d) {
  ((x - a) * (d - c)) / (b - a) + c;
}

// Linear interpolation
export function lerp(a, b, n) {
  (1 - n) * a + n * b;
}

export function calcWinsize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

// Gets the mouse position
export function getMousePos(e) {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

export function distance(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.hypot(a, b);
}

// Generate a random float.
export function getRandomFloat(min, max) {
  (Math.random() * (max - min) + min).toFixed(2);
}

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
