import type { LoaderFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';
import type { FC } from 'react';
import { isEnablePuddleApp } from '~/features/auth/is-enable-puddle-app';

export const loader: LoaderFunction = async ({ request }) => {
  const isEnableApp = await isEnablePuddleApp(request);
  if (!isEnableApp) {
    return redirect('/service-suspended');
  }
  return new Response(null, { status: 200 });
};

const RaindropPage: FC = () => {
  return <Outlet />;
};

export default RaindropPage;
