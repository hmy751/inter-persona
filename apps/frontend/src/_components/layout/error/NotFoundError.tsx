'use client';

import { APIError } from '@/_libs/error/errors';
import Button from '@repo/ui/Button';
import Text from '@repo/ui/Text';
import styles from './error.module.css';
import { useEffect } from 'react';

export default function NotFoundError({
  error,
  reset,
}: {
  error: APIError | (Error & { status?: number; message?: string });
  reset: () => void;
}) {
  useEffect(() => {
    console.error('NotFoundError page', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <Text as="h1" size="lg">
        {error instanceof APIError ? error.message : '페이지를 찾을 수 없습니다.'}
      </Text>
      <Button
        variant="outline"
        color="primary"
        size="md"
        onClick={() => {
          if (error instanceof APIError && error.reset) {
            error.reset();
          } else {
            reset();
          }
        }}
      >
        Reset
      </Button>
    </div>
  );
}
