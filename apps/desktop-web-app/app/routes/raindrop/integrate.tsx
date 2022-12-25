import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { User } from '~/domain/user';
import { getRequestUser } from '~/features/auth/get-request-user.server';
import { Profile } from '~/features/user/components/profile';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';
import raindropLogo from '~/features/raindrop/raindrop.svg';

type LoaderData = {
  me: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const user = await getRequestUser(request);

    const response: LoaderData = {
      me: user,
    };
    return json(response);
  } catch (error) {
    return handleLoaderError(error);
  }
};

const RaindropIntegratePage: FC = () => {
  const { me } = useLoaderData<LoaderData>();
  const integrateRaindrop = useCallback(() => {
    location.href = '/api/raindrop/authorize';
    return;
  }, []);
  return (
    <main className="flex flex-col gap-4 justify-between items-center h-screen p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-lg font-semibold text-gray-900">Puddle</h1>
          <p className="text-sm text-gray-600">
            Raindropと連携するとPuddleの利用を開始できます
          </p>
        </div>
        <button
          className="bg-white px-4 py-2 rounded flex items-center gap-2 border border-gray-300 hover:bg-gray-100 active:bg-gray-300 cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={integrateRaindrop}
        >
          <img src={raindropLogo} alt="" className="w-8 h-8" />
          <span className="text-gray-900 font-semibold">Raindropと連携</span>
        </button>
      </div>

      <Profile me={me} />
    </main>
  );
};

export default RaindropIntegratePage;
