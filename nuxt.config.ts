// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
  ],

  css: ['@/assets/css/main.css'],

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800],
    },
    display: 'swap',
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    elevenlabsApiKey: '',
    openrouterApiKey: '',
    public: {
      appName: 'NoteGPT',
    },
  },

  app: {
    head: {
      title: 'NoteGPT - Your All-in-One AI Learning Assistant',
      meta: [
        { name: 'description', content: 'AI-powered learning assistant for summarizing YouTube videos, PDFs, and more.' },
        { name: 'theme-color', content: '#2E83FB' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
