'use client';

import { useSelector, useDispatch } from 'react-redux';
import { selectChatContents } from '@/_store/redux/features/chat/selector';
import ChatArticle from './ChatArticle';
import { START_CHAT, initializeChatState } from '@/_store/redux/features/chat/slice';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './chat.module.css';
import { AI_NETWORK_ERROR_TOAST } from '@/_store/redux/features/chat/constants';
import useToastStore from '@repo/store/useToastStore';

import { useGetInterview } from '@/_data/interview';
import { ChatContentSpeakerType, ChatContentStatusType } from '@/_store/redux/type';

export default function ChatSection() {
  const interviewId = useParams().interviewId;
  const dispatch = useDispatch();
  const chatContents = useSelector(selectChatContents);
  const addToast = useToastStore(state => state.addToast);

  const { data, isLoading: interviewLoading } = useGetInterview(Number(interviewId));

  const interviewData = data?.interview;

  useEffect(() => {
    try {
      (async function init() {
        if (interviewLoading) {
          return;
        }

        // 이미 인터뷰가 진행된 경우
        if (interviewData?.contents?.length && interviewData.contents.length > 0) {
          dispatch(
            initializeChatState({
              contents: interviewData?.contents?.map(content => ({
                status: ChatContentStatusType.success,
                speaker: content.speaker === 'user' ? ChatContentSpeakerType.user : ChatContentSpeakerType.interviewer,
                content: content.content,
                timeStamp: new Date(content.createdAt),
              })),
              interviewId: Number(interviewId),
              interviewStatus: interviewData?.status,
            })
          );

          return;
        }

        // 인터뷰가 진행되지 않은 경우
        dispatch({
          type: START_CHAT,
          payload: {
            interviewId: interviewId,
          },
        });
      })();
    } catch (err) {
      addToast(AI_NETWORK_ERROR_TOAST);
    }

    return () => {
      dispatch(initializeChatState(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, interviewLoading]);

  if (interviewLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.chatSectionContainer}>
      {chatContents.map(({ speaker, content, status }, index) => {
        return (
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
        );
      })}
    </div>
  );
}
