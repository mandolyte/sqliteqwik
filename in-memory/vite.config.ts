import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    build: { target: ['es2020'], }, // Needed in `sqlite-wasm-esm` for big-ints to work
    optimizeDeps: {
      exclude: ['sqlite-wasm-esm'], // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
      esbuildOptions: { target: 'es2020' }, // Needed in `sqlite-wasm-esm` for big-ints to work
    }
  };
});
