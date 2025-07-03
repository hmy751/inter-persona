'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetResult } from '@/_data/result';
import { GTMViewResults } from '@/_libs/utils/analysis/result';
import { getSessionId } from '@/_libs/utils/session';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';

export default function ResultGtmLogger() {
  const params = useParams();
  const resultId = Array.isArray(params.resultId) ? params.resultId[0] : params.resultId;
  const funnelId = useFunnelIdStore(state => state.funnelId);

  const { data } = useGetResult(Number(resultId));

  useEffect(() => {
    if (data && resultId) {
      GTMViewResults({
        result_id: resultId,
        interview_id: data.interview.id.toString(),
        user_id: data.user.id.toString(),
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
      });
    }
  }, [resultId, data, funnelId]);

  return null;
}
