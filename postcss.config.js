import postcss from 'postcss';
import postcssComment from 'postcss-comment';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

export default ({ env }) => ({
  parser: postcssComment,
  plugins: [
    {
      postcssPlugin: 'grouped',
      Once(root, { result }) {
        return postcss([postcssImport]).process(root, result.opts);
      },
    },
    autoprefixer,
  ],
});
