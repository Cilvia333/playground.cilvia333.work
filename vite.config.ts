import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: `./dist`,
    emptyOutDir: true,
  },
  plugins: [
    react({
      babel: {
        plugins: [
          `babel-plugin-macros`,
          [
            `@emotion/babel-plugin-jsx-pragmatic`,
            {
              export: `jsx`,
              import: `__cssprop`,
              module: `@emotion/react`,
            },
          ],
          [
            `@babel/plugin-transform-react-jsx`,
            { pragma: `__cssprop` },
            `twin.macro`,
          ],
        ],
      },
    }),
    Pages({ nuxtStyle: true }),
  ],
  resolve: {
    alias: {
      '~/': path.join(__dirname, `./src/`),
    },
  },
});
