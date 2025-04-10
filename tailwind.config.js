const plugin = require('tailwindcss/plugin');

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
        'mobily-only': { max: '600px' },
      },
      maxWidth: {
        layout: '1600px',
      },
      spacing: {
        'ui-x': '3.75rem', //120px
        'ui-x-xs': '1.5rem', //32px
        tiny: '12px',
        small: '30px',
        unit: '60px',
        double: '120px',
        huge: '180px',
      },
      zIndex: {
        nav: '55',
        ui: '60',
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
    plugin(function ({ addVariant }) {
      addVariant('mainnav-opened', 'html[class~="mainnav--isOpened"] &');
      addVariant('backend-preview', 'html[class~="wp-toolbar"] &');
      addVariant('inview', '&[class~="is-inview"]');
      addVariant('is-active', '&[class~="is-active"]');
      addVariant('cart-opened', 'html[class~="cart-opened"] &');
    }),
  ],
};
