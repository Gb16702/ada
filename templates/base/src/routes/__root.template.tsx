/* @SLOT:IMPORTS */
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';

import appCss from '../styles/globals.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ada App' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  /* @SLOT:PROVIDERS_SETUP */
  return (
    /* @SLOT:PROVIDERS_OPEN */
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen">
        <Outlet />
        <Scripts />
      </body>
    </html>
    /* @SLOT:PROVIDERS_CLOSE */
  );
}
