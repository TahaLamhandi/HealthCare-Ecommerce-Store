import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
    build: {
        outDir: 'public/build',
        manifest: true,
        rollupOptions: {
            input: [
                'resources/js/main.jsx',
                'resources/js/app.jsx',
                'resources/css/app.css',
            ],
        },
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: false,
        hmr: {
            host: '127.0.0.1',
        },
    },
    plugins: [
        tailwind(),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/main.jsx',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom']
    },
    define: {
        global: 'globalThis',
    }
})