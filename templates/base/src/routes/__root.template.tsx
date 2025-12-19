import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
/* @SLOT:IMPORTS */

import appCss from '../styles/globals.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ada App' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  /* @SLOT:PROVIDERS_SETUP */
  return (
    /* @SLOT:PROVIDERS_OPEN */
    <html lang="en" /* @SLOT:DATA_THEME */>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-ds-background-100 font-sans antialiased">
        <Outlet />
        <Scripts />
      </body>
    </html>
    /* @SLOT:PROVIDERS_CLOSE */
  );
}
