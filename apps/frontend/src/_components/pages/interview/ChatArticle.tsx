import { createContext, useContext, useMemo } from 'react';
import styles from './chat.module.css';
import Avatar from '@repo/ui/Avatar';
import clsx from 'clsx';
import Button from '@repo/ui/Button';
import { ChatContentStatusType } from '@/_store/redux/type';
import { useDispatch, useSelector } from 'react-redux';
import { RETRY_ANSWER, CANCEL_CURRENT_REQUEST_ANSWER } from '@/_store/redux/features/chat/slice';
import { GTMAnswerCancel, GTMAnswerRetry } from '@/_libs/utils/analysis/interview';
import { getSessionId } from '@/_libs/utils/session';
import { selectInterviewId, selectChatContents } from '@/_store/redux/features/chat/selector';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';

export type ChatType = 'user' | 'interviewer' | '';

interface ChatArticleProps {
  type: ChatType;
  status: ChatContentStatusType;
  content: string | null;
  children: React.ReactNode;
}

const ChatArticleContext = createContext<{
  type: ChatType;
  status: ChatContentStatusType;
  content: string | null;
}>({ type: '', status: ChatContentStatusType.loading, content: null });

function ChatRetryCancelSelector() {
  const { status, content } = useContext(ChatArticleContext);
  const dispatch = useDispatch();
  const interviewId = useSelector(selectInterviewId);
  const contentsLength = useSelector(selectChatContents);
  const funnelId = useFunnelIdStore(state => state.funnelId);

  if (status !== ChatContentStatusType.fail) {
    return null;
  }

  const handleRetry = () => {
    dispatch({
      type: RETRY_ANSWER,
      payload: {
        content: content as unknown as string,
      },
    });

    GTMAnswerRetry({
      interview_id: interviewId?.toString() || '',
      question_id: (contentsLength || 0 + 1).toString() || '',
      retry_count: 1,
      session_id: getSessionId() || '',
      funnel_id: funnelId || '',
    });
  };

  const handleCancel = () => {
    dispatch({
      type: CANCEL_CURRENT_REQUEST_ANSWER,
    });

    GTMAnswerCancel({
      interview_id: interviewId?.toString() || '',
      last_question_id: (contentsLength || 0 + 1).toString() || '',
      reason: 'user_cancel',
      session_id: getSessionId() || '',
      funnel_id: funnelId || '',
    });
  };

  return (
    <div className={styles.retryCancelSelector}>
      <Button size="sm" variant="primary" onClick={handleRetry}>
        다시 시도하기
      </Button>
      <Button size="sm" variant="secondary" onClick={handleCancel}>
        취소하기
      </Button>
    </div>
  );
}

function ChatSpeech() {
  const { type, status, content } = useContext(ChatArticleContext);

  if (status === 'loading') {
    if (type === 'user') {
      return <div className={clsx(styles.skeletonLoader, styles.skeletonBlueBackground)} />;
    } else {
      return <div className={clsx(styles.skeletonLoader, styles.skeletonGrayBackground)} />;
    }
  }

  return <div className={type === 'user' ? styles.chatSpeechUser : styles.chatSpeechBot}>{content}</div>;
}

function ChatAvatar({ src }: { src: string }) {
  return (
    <div className={styles.avatarContainer}>
      <Avatar src={src} />
    </div>
  );
}

export default function ChatArticle({ type, children, status, content }: ChatArticleProps) {
  const contextValue = useMemo(() => ({ type, status, content }), [type, status, content]);

  return (
    <ChatArticleContext.Provider value={contextValue}>
      <div className={type === 'user' ? styles.chatArticleUser : styles.chatArticleBot}>{children}</div>
    </ChatArticleContext.Provider>
  );
}

ChatArticle.Avatar = ChatAvatar;
ChatArticle.Speech = ChatSpeech;
ChatArticle.RetryCancelSelector = ChatRetryCancelSelector;
