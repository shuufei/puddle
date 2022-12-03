import { redirect } from '@remix-run/cloudflare';
import { HttpError } from '~/errors/http-error';
import { Unauthorized } from '~/errors/unauthorized';

export const handleLoaderError = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error instanceof Unauthorized) {
      return redirect('/auth/unauthorized');
    }
    throw new Response(
      JSON.stringify({
        message: error.errorMessage,
      }),
      { status: error.statusCode, statusText: error.errorMessage }
    );
  } else {
    throw new Response(JSON.stringify({}), {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
