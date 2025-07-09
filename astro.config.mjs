// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()]
});

export default defineConfig({
  site: 'https://leksuss.github.io',
  base: '/fitmaster',
});
