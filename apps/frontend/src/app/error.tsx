'use client';

import { useEffect } from 'react';
import NotFoundError from '@/_components/layout/error/NotFoundError';
import ServerError from '@/_components/layout/error/ServerError';
import { APIError } from '@/_libs/error/errors';

export default function Error({
  error,
  reset,
}: {
  error: (Error & { digest?: string; status?: number }) | APIError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('page', error);
  }, [error]);

  if (error?.status === 404) {
    return <NotFoundError error={error} reset={reset} />;
  }

  return <ServerError error={error} reset={reset} />;
}
