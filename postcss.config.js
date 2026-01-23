import postcssComment from 'postcss-comment';

export default ({ env }) => ({
  parser: postcssComment,
  plugins: [
    // Le plugin Vite de Tailwind (@tailwindcss/vite) gère déjà @import et autoprefixer
    // pour les fichiers CSS qui importent Tailwind.
    // Si vous avez besoin d'autres plugins PostCSS spécifiques, ajoutez-les ici.
  ],
});
