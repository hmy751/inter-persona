'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';
import { usePathname } from 'next/navigation';
import { GTMPageView, GTMPageExit } from '@/_libs/utils/analysis/page';

export default function Initialize() {
  const { setFunnelId, clearFunnelId } = useFunnelIdStore();
  const id = uuidv4();
  const path = usePathname();

  useEffect(() => {
    setFunnelId(id);

    return () => {
      clearFunnelId();
    };
  }, []);

  useEffect(() => {
    GTMPageView({ page_location: path });

    return () => {
      GTMPageExit({ page_location: path });
    };
  }, [path]);

  return <></>;
}
