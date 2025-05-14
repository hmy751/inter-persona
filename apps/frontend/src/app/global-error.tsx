'use client';

import { Noto_Sans_KR } from 'next/font/google';
import '@repo/ui/styles/globals.css';
import styles from '@/_components/layout/error/error.module.css';
import Text from '@repo/ui/Text';
import Button from '@repo/ui/Button';

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
});

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className={noto_sans_kr.className}>
        <div className={styles.globalErrorContainer}>
          <Text as="h1" size="xl">
            서비스에 문제가 발생했습니다.
          </Text>
          <Button variant="outline" size="lg" color="secondary" onClick={() => reset()}>
            다시 시도해주세요.
          </Button>
        </div>
      </body>
    </html>
  );
}
