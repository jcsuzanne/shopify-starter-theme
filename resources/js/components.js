import { load } from 'piecesjs';

export const updateComponents = (context) => {
  load(
    'c-scroll',
    () => import('/resources/js/components/ScrollLite.js'),
    context,
  );
  load(
    'cart-opentrigger',
    () => import('/resources/js/components/CartOpenTrigger.js'),
    context,
  );
  load(
    'password-access',
    () => import('/resources/js/components/PasswordAccess.js'),
    context,
  );
  load(
    'pdp-addtocart',
    () => import('/resources/js/components/PDPAddToCart.js'),
    context,
  );
  load('ui-view', () => import('/resources/js/components/UIview.js'), context);
};
