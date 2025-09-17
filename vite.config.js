import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            include: "**/*.{jsx,tsx}",
        }),
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/main.jsx'
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
        cors: true,
        strictPort: true,
        port: 5173,
    },
});
