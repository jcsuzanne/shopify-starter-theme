import { defineConfig, loadEnv } from 'vite';
import shopify from 'vite-plugin-shopify';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    clearScreen: false,
    server: {
      host: '127.0.0.1',
      https: false,
      port: 3000,
      hmr: true,
      watch: {
        usePolling: true,
        interval: 2500,
      },
    },
    build: {
      manifest: '_manifest.json',
      emptyOutDir: false,
      rollupOptions: {
        input: 'resources/js/app.js',
        output: {
          entryFileNames: 'app.[hash].js',
          chunkFileNames: 'app.[hash].js',
          assetFileNames: 'app.[hash][extname]',
          manualChunks: () => 'app',
        },
      },
    },
    plugins: [
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
};
