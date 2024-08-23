import { load } from 'piecesjs';

export const updateComponents = (context) => {
  load('c-scroll', () => import('/resources/js/components/Scroll.js'), context);
};
