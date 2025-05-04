'use client';

import { useState, useEffect } from 'react';

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isWorkerReady, setIsWorkerReady] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MSW === 'true') {
      (async function () {
        const { worker } = await import('@/_mocks/browser');
        await worker.start({
          quiet: false,
        });
        setIsWorkerReady(true);
      })();
    }
  }, []);

  if (!isWorkerReady) {
    return null;
  }

  return <>{children}</>;
}
