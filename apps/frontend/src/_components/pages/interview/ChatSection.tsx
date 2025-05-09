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

import { useGetInterviewContents, useGetInterviewInterviewer, useGetInterviewUser } from '@/_data/interview';
import { ChatContentSpeakerType, ChatContentStatusType } from '@/_store/redux/type';

export default function ChatSection() {
  const interviewId = useParams().interviewId;
  const dispatch = useDispatch();
  const chatContents = useSelector(selectChatContents);
  const addToast = useToastStore(state => state.addToast);

  const { data: interviewerData, isLoading: interviewerLoading } = useGetInterviewInterviewer(Number(interviewId));
  const { data: userData, isLoading: userLoading } = useGetInterviewUser(Number(interviewId));
  const { data: contentsData, isLoading: contentsLoading } = useGetInterviewContents(Number(interviewId));

  useEffect(() => {
    try {
      (async function init() {
        if (contentsLoading) {
          return;
        }

        if (contentsData?.contents?.length && contentsData.contents.length > 0) {
          dispatch(
            initializeChatState(
              contentsData.contents.map(content => ({
                status: ChatContentStatusType.loading,
                speaker: content.speaker === 'user' ? ChatContentSpeakerType.user : ChatContentSpeakerType.interviewer,
                content: content.content,
                timeStamp: new Date(content.createdAt),
              }))
            )
          );
          return;
        }

        dispatch({
          type: START_CHAT,
          payload: {
            interviewId: interviewId,
            content: '안녕하세요. 간단히 자기소개 부탁드립니다.',
          },
        });
      })();
    } catch (err) {
      addToast(AI_NETWORK_ERROR_TOAST);
    }

    return () => {
      dispatch(initializeChatState(null));
    };
  }, [interviewId, contentsLoading]);

  if (interviewerLoading || userLoading || contentsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.chatSectionContainer}>
      {chatContents.map(({ speaker, content, status }, index) => {
        return (
          <ChatArticle key={`${speaker}-${index}`} type={speaker} status={status} content={content}>
            {speaker === ChatContentSpeakerType.interviewer ? (
              <>
                <ChatArticle.Avatar src={interviewerData?.interviewer.profileImageUrl ?? ''} />
                <ChatArticle.Speech />
              </>
            ) : (
              <>
                <ChatArticle.Speech />
                <ChatArticle.Avatar src={userData?.user.profileImageUrl ?? ''} />
                <ChatArticle.RetryCancelSelector />
              </>
            )}
          </ChatArticle>
        );
      })}
    </div>
  );
}
