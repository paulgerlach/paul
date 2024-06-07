// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                gerate: resolve(__dirname, 'nested/gerate.html'),
                contact: resolve(__dirname, 'nested/contact.html'),
                datenschutzhinweise: resolve(__dirname, 'nested/datenschutzhinweise.html'),
                functionen: resolve(__dirname, 'nested/functionen.html'),
                impressum: resolve(__dirname, 'nested/impressum.html'),
                prising: resolve(__dirname, 'nested/prising.html'),
                questionare: resolve(__dirname, 'nested/questionare.html'),
                regulatoric: resolve(__dirname, 'nested/regulatoric.html'),
            },
        },
    },
});