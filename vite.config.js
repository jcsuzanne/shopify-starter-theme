import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import tailwindcss from '@tailwindcss/vite';

// On a .liquid change, @tailwindcss/vite and vite-plugin-shopify (liquid-tailwind-refresh) both end up
// in a full reload, fired before the Shopify CLI has synced the file: the page reloads with the old markup.
// Hot update the CSS ourselves (picks up new Tailwind classes) and return no module so the other plugins skip it.
// The Shopify CLI hot reload then refreshes the markup once synced.
const liquidCssHotUpdate = () => ({
  name: 'liquid-css-hot-update',
  enforce: 'pre',
  hotUpdate({ file }) {
    if (!file.endsWith('.liquid')) return;

    if (this.environment.name === 'client') {
      // reloadModule sends the HMR update directly, without going through the plugins' hotUpdate hooks again
      [...this.environment.moduleGraph.idToModuleMap.values()]
        .filter((mod) => mod.file?.endsWith('.css'))
        .forEach((mod) => this.environment.reloadModule(mod));
    }

    return [];
  },
});

export default defineConfig({
  clearScreen: false,
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  build: {
    manifest: '_manifest.json',
    emptyOutDir: false,
    rolldownOptions: {
      input: 'resources/js/app.js',
      output: {
        // Every file is prefixed with "app." so the `clean` script can wipe old builds
        entryFileNames: 'app.[hash].js',
        assetFileNames: 'app.[hash][extname]',
        // Single bundle: pieces loaded with import() are inlined, no request waterfall
        codeSplitting: false,
      },
    },
  },
  plugins: [
    // Must run before tailwindcss() to take over its .liquid full reload
    liquidCssHotUpdate(),
    tailwindcss(),
    shopify({
      themeHotReload: false,
      themeRoot: './',
      sourceCodeDir: 'resources',
      // Front-end entry points directory
      entrypointsDir: 'resources/js',
      additionalEntrypoints: [
        'resources/**/*.js', // relative to themeRoot
      ],
    }),
  ],
});
