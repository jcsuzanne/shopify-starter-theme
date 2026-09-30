import { load } from 'piecesjs';

// define() upgrades existing elements synchronously, so stylesReady is set once load() resolves
export const loadPiece = async (tag, importer, context = document) => {
  await load(tag, importer, context);
  await Promise.all(
    Array.from(context.getElementsByTagName(tag), (el) => el.stylesReady),
  );
};

export const updateComponents = (context) =>
  Promise.allSettled([
    loadPiece(
      'c-scroll',
      () => import('/resources/js/components/ScrollLite.js'),
      context,
    ),
    loadPiece(
      'cart-opentrigger',
      () => import('/resources/js/components/CartOpenTrigger.js'),
      context,
    ),
    loadPiece(
      'password-access',
      () => import('/resources/js/components/PasswordAccess.js'),
      context,
    ),
    loadPiece(
      'pdp-addtocart',
      () => import('/resources/js/components/PDPAddToCart.js'),
      context,
    ),
    loadPiece(
      'ui-view',
      () => import('/resources/js/components/UIview.js'),
      context,
    ),
  ]);
