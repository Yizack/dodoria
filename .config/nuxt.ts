export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  app: {
    head: {
      htmlAttrs: {
        lang: "es"
      },
      bodyAttrs: {
        class: "bg-primary"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#f697c8" }
      ],
      link: [
        { rel: "preload", as: "style", crossorigin: "anonymous", href: "https://fonts.googleapis.com/css?family=Roboto:400,300" },
        { rel: "stylesheet", crossorigin: "anonymous", href: "https://fonts.googleapis.com/css?family=Roboto:400,300" }
      ]
    }
  },

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/dodoria.css"
  ],

  experimental: {
    typedPages: true
  },

  features: {
    inlineStyles: false
  },

  nitro: {
    imports: {
      dirs: ["server/utils/handlers"]
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/images/*"]
        }
      }
    },
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: "esnext"
      }
    }
  },

  modules: [
    "@nuxt/eslint",
    "nuxt-webhook-validators",
    "@nuxthub/core"
  ],

  runtimeConfig: {
    webhook: {
      discord: {
        publicKey: ""
      }
    },
    discord: {
      token: "",
      applicationId: ""
    },
    cdnToken: ""
  },

  hub: {
    blob: true,
    cache: true
  },

  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },

  compatibilityDate: "2024-08-04"
});
