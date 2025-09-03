// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  site: process.env.NODE_ENV === 'production' 
    ? 'https://fitmaster-r0d24sg6f-leksus-projects.vercel.app' 
    : 'https://leksuss.github.io',
  base: process.env.NODE_ENV === 'production' ? '' : '/fitmaster',
});
