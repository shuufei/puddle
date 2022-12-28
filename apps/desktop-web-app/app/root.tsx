import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useState } from 'react';
import { SSRProvider } from 'react-aria';
import { Alert } from './shared/components/alert';
import type { AlertData } from './shared/components/alert/alert-context';
import { AlertContext } from './shared/components/alert/alert-context';

import styles from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Puddle',
  viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
  env: {
    endpoint: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    env: {
      endpoint: ENDPOINT,
    },
  };
  return json(data);
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  const [alertData, setAlertData] = useState<AlertData | undefined>();
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <SSRProvider>
          <AlertContext.Provider
            value={{
              alert: alertData,
              setAlert: (data) => {
                setAlertData(data);
              },
            }}
          >
            <Outlet />
            <Alert />
          </AlertContext.Provider>
        </SSRProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  );
}
