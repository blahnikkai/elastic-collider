import { defineConfig } from 'vite';

// Update this if you're using a framework like React, Vue, or Svelte
export default defineConfig({
  base: '/elastic-collider/',
  server: {
    port: 5500, // Change the dev server port if needed
  },
  build: {
    outDir: 'dist', // Output directory for production builds
  },
});
