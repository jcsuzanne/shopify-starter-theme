import { defineConfig, loadEnv } from 'vite';
import shopify from 'vite-plugin-shopify';
import pageReload from 'vite-plugin-page-reload';
import basicSsl from '@vitejs/plugin-basic-ssl';
import cleanup from '@by-association-only/vite-plugin-shopify-clean';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    clearScreen: false,
    server: {
      host: '127.0.0.1',
      https: false,
      port: 3000,
      hmr: true,
    },
    publicDir: 'public',
    build: {
      manifest: '_manifest.json',
      emptyOutDir: false,
      rollupOptions: {
        input: 'resources/js/app.js',
        output: {
          entryFileNames: 'app.[hash].js',
          chunkFileNames: 'app.[hash].js',
          assetFileNames: 'app.[hash].[extname]',
          manualChunks: () => 'app',
        },
      },
    },
    plugins: [
      basicSsl(),
      cleanup(),
      shopify({
        themeHotReload: false,
        themeRoot: './',
        snippetFile: 'vite.liquid',
        sourceCodeDir: 'resources',
        // Front-end entry points directory
        entrypointsDir: 'resources/js',
        additionalEntrypoints: [
          'resources/**/*.js', // relative to themeRoot
        ],
      }),
      pageReload('/tmp/theme.update', {
        // delay: 2000,
      }),
      {
        name: 'vite-plugin-liquid-tailwind-refresh',
        handleHotUpdate(ctx) {
          if (ctx.file.endsWith('.liquid')) {
            // Filter out the liquid module to prevent a full refresh
            return [
              ...(ctx.modules[0]?.importers ?? []),
              ...ctx.modules.slice(1),
            ];
          }
        },
      },
    ],
  });
};
