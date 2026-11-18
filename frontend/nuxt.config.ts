import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  // The board runs only in the browser, so every request to the backend comes from the browser.
  ssr: false,
  modules: ['shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    public: { apiBase: 'http://localhost:3001' },
  },
  // Workaround for Nuxt 4.6 on Windows: without it Nitro leaves Nuxt's own renderer unbundled,
  // and every page fails with "Either manifest or precomputed data must be provided".
  nitro: {
    externals: { inline: [/[\\/]nuxt[\\/]dist[\\/]/] },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
