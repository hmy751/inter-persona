'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelId';

export default function Initialize() {
  const { setFunnelId, clearFunnelId } = useFunnelIdStore();
  const id = uuidv4();

  useEffect(() => {
    setFunnelId(id);

    return () => {
      clearFunnelId();
    };
  }, []);

  return <></>;
}
