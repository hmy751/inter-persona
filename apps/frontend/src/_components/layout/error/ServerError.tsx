'use client';

import Text from '@repo/ui/Text';
import Button from '@repo/ui/Button';
import { APIError } from '@/_libs/error/errors';
import styles from './error.module.css';
import { useEffect } from 'react';
export default function ServerError({
  error,
  reset,
}: {
  error?: APIError | (Error & { status?: number; message?: string });
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ServerError page', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <Text as="h1" size="lg">
        {error instanceof APIError ? error.message : '일시적인 네트워크 오류가 발생했습니다'}
      </Text>
      <Button
        variant="outline"
        color="secondary"
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
