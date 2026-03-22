import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    cssMinify: true,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/'))
            return 'react-vendor';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/'))
            return 'router';
          if (id.includes('node_modules/@supabase'))
            return 'supabase';
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform') || id.includes('node_modules/zod'))
            return 'forms';
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/zustand'))
            return 'ui';
        },
      },
    },
  },

  // Dev server optimizations
  server: {
    hmr: { overlay: true },
  },

  // Preload key assets
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
