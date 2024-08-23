let postcss = require('postcss');

module.exports = ({ env }) => ({
  parser: require('postcss-comment'),
  plugins: [
    {
      postcssPlugin: 'grouped',
      Once(root, { result }) {
        return postcss([
          require('@csstools/postcss-global-data')({
            files: ['./resources/css/settings/config.css'],
          }),
          require('postcss-import-ext-glob'),
          require('postcss-import'),
          require('postcss-mixins'),
          require('postcss-for'),
          require('postcss-simple-vars'),
          require('postcss-custom-media'),
        ]).process(root, result.opts);
      },
    },
    require('postcss-extend-rule'),
    require('@tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-flexbugs-fixes'),
    require('postcss-utilities'),
    require('postcss-calc'),
    require('postcss-pxtorem'),
    env === 'production' ? require('cssnano')() : false,
  ],
});
