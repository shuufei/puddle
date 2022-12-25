import { redirect } from '@remix-run/cloudflare';
import { HttpError } from '~/errors/http-error';
import { NotIntegrateRaindrop } from '~/errors/not-integrate-raindrop';
import { Unauthorized } from '~/errors/unauthorized';

export const handleLoaderError = (error: unknown) => {
  console.error('[ERROR] loader error: ', error);
  if (error instanceof HttpError) {
    if (error instanceof Unauthorized) {
      return redirect('/auth/sign-in');
    }
    throw new Response(
      JSON.stringify({
        message: error.errorMessage,
      }),
      { status: error.statusCode, statusText: error.errorMessage }
    );
  } else if (error instanceof NotIntegrateRaindrop) {
    return redirect('/raindrop/integrate');
  } else {
    throw new Response(JSON.stringify({}), {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
