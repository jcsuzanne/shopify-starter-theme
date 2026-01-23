import postcssComment from 'postcss-comment';
import postcssFor from 'postcss-for';
import postcssSimpleVars from 'postcss-simple-vars';
import postcssCalc from 'postcss-calc';

const config = {
  parser: postcssComment,
  plugins: [
    // Le plugin Vite de Tailwind (@tailwindcss/vite) gère déjà @import et autoprefixer
    // pour les fichiers CSS qui importent Tailwind.
    // Plugins nécessaires pour animations.css qui utilise @for et des calculs
    // IMPORTANT: postcss-for doit être AVANT postcss-simple-vars
    postcssFor, // Pour les boucles @for dans animations.css (doit être en premier)
    postcssSimpleVars, // Pour les variables $i utilisées dans les boucles
    postcssCalc, // Pour les calculs comme (0.1s * $i) + 0.3s
  ],
};

export default config;
