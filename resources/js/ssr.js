import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import React from 'react';
import { renderToString } from 'react-dom/server';

export default function render(page) {
  return createServer((page) =>
    createInertiaApp({
      page,
      render: renderToString,
      resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
      },
      setup: ({ App, props }) => <App {...props} />,
    })
  )(page);
}
