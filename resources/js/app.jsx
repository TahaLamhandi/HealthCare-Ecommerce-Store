import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './contexts/ThemeContext.js';

// Main App component
export default function App({ children }) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {children}
        </div>
    );
}

// Initialize the Inertia app
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        const page = pages[`./pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page ${name} not found`);
        }
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <React.StrictMode>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </React.StrictMode>
        );
    },
});
