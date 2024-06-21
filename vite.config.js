// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        gerate: resolve(__dirname, "gerate.html"),
        kontakt: resolve(__dirname, "kontakt.html"),
        datenschutzhinweise: resolve(__dirname, "datenschutzhinweise.html"),
        funktionen: resolve(__dirname, "funktionen.html"),
        impressum: resolve(__dirname, "impressum.html"),
        preise: resolve(__dirname, "preise.html"),
        fragebogen: resolve(__dirname, "fragebogen.html"),
        regulatorik: resolve(__dirname, "./blog/regulatorik.html"),
      },
    },
  },
});
