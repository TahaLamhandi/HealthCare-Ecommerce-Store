import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react({
            jsxRuntime: 'automatic',
            include: '**/*.{js,jsx,ts,tsx}',
            exclude: '**/node_modules/**'
        }),
        react({
            jsxImportSource: '@emotion/react',
            include: '**/*.{js,jsx,ts,tsx}',
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
})
