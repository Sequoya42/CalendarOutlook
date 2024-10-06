import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import {vitePreprocess} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    alias: {
      // This will match the `components` folder and its contents.
      '$components': path.resolve('./src/components'),
      '$dtos': path.resolve('./src/dtos'),
      '$store': path.resolve('./src/store')
    },
    adapter: adapter()
  }
};

export default config;
