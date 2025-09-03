// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';

// https://astro.build/config
// Определяем, работаем ли мы на Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

export default defineConfig({
  integrations: [vue()],
  output: 'server',
  adapter: vercel(),
  site: isVercel
    ? 'https://fitmaster-r0d24sg6f-leksus-projects.vercel.app' 
    : 'https://leksuss.github.io',
  base: isVercel ? '' : '/fitmaster',
});
