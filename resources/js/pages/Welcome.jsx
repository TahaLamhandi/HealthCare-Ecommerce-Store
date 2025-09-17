import React from 'react';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <Head title="Welcome" />
            <div className="w-full max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Welcome to BioEcleel
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Your application is running successfully!
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        This is a test page to verify that your React + Inertia.js + Vite setup is working correctly.
                    </p>
                </div>
            </div>
        </div>
    );
}
