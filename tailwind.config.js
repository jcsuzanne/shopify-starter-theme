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
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1400px',
      '2xl': '1680px',
    },
    fontFamily: {},
    maxWidth: {
      layout: '1600px',
    },
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
      spacing: {
        'ui-x': '7.5rem', //120px
        'ui-x-mobile': '2rem', //32px
      },
      zIndex: {
        ui: '60',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-easing'),
    plugin(function ({ addVariant }) {
      addVariant('mainnav-opened', 'html[class~="mainnav--isOpened"] &');
    }),
  ],
};
