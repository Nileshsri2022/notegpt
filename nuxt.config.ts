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
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
    },
  },

  runtimeConfig: {
    elevenlabsApiKey: '',
    openrouterApiKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    supabaseServiceRoleKey: '',
    public: {
      appName: 'NoteGPT',
      stripePublishableKey: '',
      supabaseUrl: process.env.SUPABASE_URL || '',
    },
  },

  app: {
    head: {
      title: 'NoteGPT - Your All-in-One AI Learning Assistant',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'AI-powered learning assistant. Summarize YouTube videos, PDFs, articles. Generate flashcards, quizzes, mind maps. Chat with AI. 80M+ users.' },
        { name: 'theme-color', content: '#2E83FB' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'NoteGPT' },
        { property: 'og:title', content: 'NoteGPT - Your All-in-One AI Learning Assistant' },
        { property: 'og:description', content: 'AI-powered learning assistant. Summarize YouTube videos, PDFs, articles. Generate flashcards, quizzes, mind maps. Chat with AI.' },
        { property: 'og:image', content: 'https://cdn.notegpt.io/notegpt/static/logo/NoteGPT_logo_blue.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@NoteGPT_AINote' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://cdn.notegpt.io/notegpt/static/logo/NoteGPT_logo_blue.png' },
      ],
    },
  },
})
