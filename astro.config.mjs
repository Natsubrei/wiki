import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:8080',
  trailingSlash: 'never',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
