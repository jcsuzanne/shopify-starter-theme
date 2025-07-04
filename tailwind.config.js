const plugin = require('tailwindcss/plugin');
import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './resources/js/**/*.js',
    './resources/css/**/*.css',
  ],
  prefix: 'tw-',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1400px',
      '2xl': '1680px',
    },
    fontFamily: {},
    extend: {
      colors: {},
      screens: {
        'below-lg': { max: '1023px' },
        lt: { min: '1440px' },
        '3xl': { min: '1900px' },
        '4xl': { min: '2100px' },
        'h-xs': { raw: '(max-height: 800px) and (min-width:1024px)' },
        'h-mobile-lg': {
          raw: 'only screen and (min-height: 700px) and (max-height: 1000px) and (orientation: portrait)',
        },
        'mobile-only': { max: '600px' },
        'small-height': {
          raw: 'only screen and (max-height: 850px)',
        },
      },
      fontSize: {
        xxxs: '10px',
        xxs: '11px',
        xsm: '13px',
      },
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
        '32': 'repeat(32, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26',
        'span-27': 'span 27 / span 27',
        'span-28': 'span 28 / span 28',
        'span-29': 'span 29 / span 29',
        'span-30': 'span 30 / span 30',
        'span-31': 'span 31 / span 31',
        'span-32': 'span 32 / span 32',
      },
      gridColumnStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
        '25': '25',
        '26': '26',
        '27': '27',
        '28': '28',
        '29': '29',
        '30': '30',
        '31': '31',
        '32': '32',
        '33': '33',
      },
      lineHeight: {
        xxs: '11px',
        xxxs: '10px',
        xs: '12px',
        sm: '14px',
        xsm: '13px',
        'base-lg': '18px',
      },
      spacing: {
        'outer-x-lg': '1.5rem',
        'outer-x-xs': '.9375rem',
        'outer-y-lg': '8.125rem',
        'outer-y-xs': '5rem',
        tiny: '12px',
        small: '30px',
        unit: '60px',
        double: '120px',
        huge: '180px',
        hview: '100svh',
      },
      transitionTimingFunction: {
        'in-out-power2': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        'out-power2': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      zIndex: {
        nav: '55',
        'ui-behind': '59',
        ui: '60',
        modal: '80',
        cart: '90',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-easing'),
    plugin(function ({ addVariant, addUtilities }) {
      addVariant('backend-preview', 'html[class~="wp-toolbar"] &');
      addVariant('local-env', 'html[class~="local-env"] &');
      addVariant('mainnav-opened', 'html[class~="has-nav-open"] &');
      addVariant('mainnav-closing', 'html[class~="has-nav-closing"] &');
      addVariant('mainnav-closed', 'html[class~="has-nav-closed"] &');
      addVariant('cart-opened', 'html[class~="cart-opened"] &');
      addVariant(
        'newsletter-modal-opened',
        'html[class~="newsletter-modal-opened"] &',
      );
      addVariant('product-unavailable', 'html[class~="product-unavailable"] &');
      addVariant('inview', '&[class~="is-inview"]');
      addVariant('is-selected', '&[class~="is-selected"]');
      addVariant('footer-inview', 'html[class~="footer-inview"] &');
      addVariant('promo-bar', 'html[class~="with-announcement"] &');
      addVariant('is-active', '&[class~="is-active"]');
      addVariant('ui-ready', 'html[class~="ui-ready"] &');
      addVariant('ui-finalized', 'html[class~="ui-finalized"] &');
      addVariant('cart-updating', 'html[class~="cart-updating"] &');
      addVariant(
        'newsletter-registered',
        'html[class~="newsletter-registered"] &',
      );
      addUtilities({
        '.dom': {
          position: 'relative',
          zIndex: '10',
          display: 'block',
        },
      });
    }),
  ],
};
