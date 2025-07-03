'use client';

import { useSelector, useDispatch } from 'react-redux';
import { selectChatContents } from '@/_store/redux/features/chat/selector';
import ChatArticle from './ChatArticle';
import { START_CHAT, initializeChatState } from '@/_store/redux/features/chat/slice';
import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './chat.module.css';
import { useGetInterview } from '@/_data/interview';
import { ChatContentSpeakerType, ChatContentStatusType } from '@/_store/redux/type';
import { GTMInterviewStarted } from '@/_libs/utils/analysis/interview';
import { getSessionId } from '@/_libs/utils/session';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';
import { ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';
import Text from '@repo/ui/Text';

function ChatSection() {
  const interviewId = Number(useParams().interviewId);
  const dispatch = useDispatch();
  const chatContents = useSelector(selectChatContents);
  const funnelId = useFunnelIdStore(state => state.funnelId);
  const isInitialized = useRef(false);

  const { data } = useGetInterview(interviewId);
  const interviewData = data?.interview;

  if (!isInitialized.current) {
    if (interviewData?.contents?.length && interviewData.contents.length > 0) {
      dispatch(
        initializeChatState({
          contents: interviewData.contents.map(content => ({
            status: ChatContentStatusType.success,
            speaker: content.speaker === 'user' ? ChatContentSpeakerType.user : ChatContentSpeakerType.interviewer,
            content: content.content,
            timeStamp: new Date(content.createdAt),
          })),
          interviewId: interviewId,
          interviewStatus: interviewData.status,
        })
      );
    } else {
      GTMInterviewStarted({
        interview_id: interviewData?.id.toString() || '',
        interviewer_id: interviewData?.interviewer?.id.toString() || '',
        user_id: interviewData?.user?.id.toString() || '',
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
        category: interviewData?.category || '',
      });

      dispatch({
        type: START_CHAT,
        payload: {
          interviewId: interviewId,
        },
      });
    }
    isInitialized.current = true;
  }

  useEffect(() => {
    return () => {
      dispatch(initializeChatState(null));
    };
  }, [dispatch]);

  return (
    <section className={styles.chatSectionContainer}>
      {chatContents.map(({ speaker, content, status }, index) => (
        <ChatArticle key={`${speaker}-${index}`} type={speaker} status={status} content={content}>
          {speaker === ChatContentSpeakerType.interviewer ? (
            <>
              <ChatArticle.Avatar src={interviewData?.interviewer?.profileImageUrl ?? ''} />
              <ChatArticle.Speech />
            </>
          ) : (
            <>
              <ChatArticle.Speech />
              <ChatArticle.Avatar src={interviewData?.user?.profileImageUrl ?? ''} />
              <ChatArticle.RetryCancelSelector />
            </>
          )}
        </ChatArticle>
      ))}
    </section>
  );
}

export default ChatSection;

function Loading() {
  return (
    <section className={styles.chatSectionContainer}>
      <div className={`${styles.skeletonChat} ${styles.skeletonChatInterviewer}`} />
      <div className={`${styles.skeletonChat} ${styles.skeletonChatUser}`} />
      <div className={`${styles.skeletonChat} ${styles.skeletonChatInterviewer}`} />
    </section>
  );
}

function Error({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <section className={styles.chatSectionContainer}>
      <Text as="p" size="md" color="error">
        채팅을 불러오는 데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </section>
  );
}

ChatSection.Loading = Loading;
ChatSection.Error = Error;
