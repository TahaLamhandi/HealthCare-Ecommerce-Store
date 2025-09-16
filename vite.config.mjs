import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [
        react({
            include: "**/*.{js,jsx,ts,tsx}",
        }),
        laravel({
            input: ['resources/css/app.css', 'resources/js/main.jsx'],
            refresh: true,
        }),
    ],
    build: {
        outDir: 'public/build',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['framer-motion', 'lucide-react']
                }
            }
        }
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
})
