// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
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
  env: {
    schema: {
      SMTP_HOST: envField.string({ context: 'server', access: 'secret' }),
      SMTP_PORT: envField.string({ context: 'server', access: 'secret', default: '587' }),
      SMTP_SECURE: envField.string({ context: 'server', access: 'secret', default: 'false' }),
      SMTP_USER: envField.string({ context: 'server', access: 'secret' }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret' }),
      RECIPIENT_EMAIL: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
