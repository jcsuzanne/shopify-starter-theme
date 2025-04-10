import { load } from 'piecesjs';

export const updateComponents = (context) => {
  load('c-scroll', () => import('/resources/js/components/Scroll.js'), context);
  load(
    'cart-opentrigger',
    () => import('/resources/js/components/CartOpenTrigger.js'),
    context,
  );
  load('ui-view', () => import('/resources/js/components/UIview.js'), context);
};
