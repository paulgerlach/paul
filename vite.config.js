// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                gerate: resolve(__dirname, 'gerate.html'),
                contact: resolve(__dirname, 'contact.html'),
                datenschutzhinweise: resolve(__dirname, 'datenschutzhinweise.html'),
                functionen: resolve(__dirname, 'functionen.html'),
                impressum: resolve(__dirname, 'impressum.html'),
                prising: resolve(__dirname, 'prising.html'),
                questionare: resolve(__dirname, 'questionare.html'),
                regulatoric: resolve(__dirname, 'regulatoric.html'),
            },
        },
    },
});