import { load } from 'piecesjs';

// define() upgrades existing elements synchronously, so stylesReady is set once load() resolves
export const loadPiece = async (tag, importer, context = document) => {
  const start = performance.now();
  await load(tag, importer, context);
  const instances = context.getElementsByTagName(tag);
  await Promise.all(Array.from(instances, (el) => el.stylesReady));

  // Single bundle: the time is mostly stylesReady + mount, not a network load
  if (import.meta.env.DEV && instances.length) {
    const end = performance.now();
    console.debug(
      `%c[piecesjs] ✓ ${tag} loaded ×${instances.length} — ${Math.round(end - start)}ms (at ${Math.round(end)}ms)`,
      'background:#e9dcff;color:#3b2a5c;padding:2px 6px;border-radius:3px',
    );
  }
};

const loadAll = (pieces, context) =>
  Promise.allSettled(
    pieces.map(([tag, importer]) => loadPiece(tag, importer, context)),
  );

// Pieces outside the swup container (layout shell): loaded once, they survive page transitions.
const GLOBAL_PIECES = [
  // Page transitions (swup) are opt-in: uncomment to enable them on a project
  // ['c-transitions', () => import('/resources/js/components/Transitions.js')],
  ['ui-view', () => import('/resources/js/components/UIview.js')],
  [
    'password-access',
    () => import('/resources/js/components/PasswordAccess.js'),
  ],
];

// Pieces inside the swup container: reloaded on the new container at every page transition.
// ScrollLite.js: native scroll. Scroll.js: Lenis smooth scroll, parallax, horizontal mode
const PIECES = [
  ['c-scroll', () => import('/resources/js/components/Scroll.js')],
  [
    'cart-opentrigger',
    () => import('/resources/js/components/CartOpenTrigger.js'),
  ],
  ['pdp-addtocart', () => import('/resources/js/components/PDPAddToCart.js')],
  ['video-detector', () => import('/resources/js/components/VideoDetector.js')],
];

export const loadGlobalComponents = () => loadAll(GLOBAL_PIECES, document);

export const updateComponents = (context = document) =>
  loadAll(PIECES, context);
