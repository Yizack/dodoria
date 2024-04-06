export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "es"
      },
      bodyAttrs: {
        class: "bg-primary"
      },
      meta: [
        { charset: "utf-8"},
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#f697c8" }
      ],
      link: [
        { rel: "preload", as: "style", crossorigin: "anonymous", href: "https://fonts.googleapis.com/css?family=Roboto:400,300" },
        { rel: "stylesheet", crossorigin: "anonymous", href: "https://fonts.googleapis.com/css?family=Roboto:400,300" },
      ]
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/dodoria.css"
  ],
  features: {
    inlineStyles: false
  }
});
