import type { Meta } from '@storybook/react';
import ChatArticle from '@/_components/pages/interview/ChatArticle';
import { ChatContentSpeakerType, ChatContentStatusType } from '@/_store/redux/type';

const interviewer = {
  imgUrl: '/assets/images/elon_musk.png',
  name: 'Elon Musk',
  description: 'CEO of SpaceX, Tesla, and Neuralink',
};

const user = {
  imageSrc: '/assets/images/dev_profile.png',
};

const meta = {
  title: 'Pages/Interview/ChatArticle',
  component: ChatArticle,
  parameters: {
    layout: 'Desktop',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatArticle>;

export default meta;

const mockInterviewerChatContent = {
  status: ChatContentStatusType.success,
  speaker: ChatContentSpeakerType.interviewer,
  content: '안녕하세요. 간단히 자기소개 부탁드립니다.',
  timeStamp: new Date(),
};

export const InterviewerChat = {
  render: () => {
    const { status, speaker, content } = mockInterviewerChatContent;

    return (
      <ChatArticle type={speaker} status={status} content={content}>
        <ChatArticle.Avatar src={interviewer?.imgUrl} />
        <ChatArticle.Speech />
      </ChatArticle>
    );
  },
};

const mockLoadingInterviewerChatContent = {
  status: ChatContentStatusType.loading,
  speaker: ChatContentSpeakerType.interviewer,
  content: '',
  timeStamp: new Date(),
};

export const InterviewerChatWithLoading = {
  render: () => {
    const { status, speaker, content } = mockLoadingInterviewerChatContent;

    return (
      <ChatArticle type={speaker} status={status} content={content}>
        <ChatArticle.Avatar src={interviewer?.imgUrl} />
        <ChatArticle.Speech />
      </ChatArticle>
    );
  },
};

const mockUserChatContent = {
  status: ChatContentStatusType.success,
  speaker: ChatContentSpeakerType.user,
  content: '안녕하세요 개발자 입니다.',
  timeStamp: new Date(),
};

export const UserChat = {
  render: () => {
    const { status, speaker, content } = mockUserChatContent;

    return (
      <ChatArticle type={speaker} status={status} content={content}>
        <ChatArticle.Speech />
        <ChatArticle.Avatar src={user?.imageSrc} />
      </ChatArticle>
    );
  },
};

const mockLoadingUserChatContent = {
  status: ChatContentStatusType.loading,
  speaker: ChatContentSpeakerType.user,
  content: '',
  timeStamp: new Date(),
};

export const UserChatWithLoading = {
  render: () => {
    const { status, speaker, content } = mockLoadingUserChatContent;

    return (
      <ChatArticle type={speaker} status={status} content={content}>
        <ChatArticle.Speech />
        <ChatArticle.Avatar src={user?.imageSrc} />
      </ChatArticle>
    );
  },
};

const mockUserChatContentWithInterviewerError = {
  status: ChatContentStatusType.fail,
  speaker: ChatContentSpeakerType.user,
  content: '안녕하세요 개발자 입니다.',
  timeStamp: new Date(),
};

export const UserChatWithInterviewerError = {
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ height: '200px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const { status, speaker, content } = mockUserChatContentWithInterviewerError;

    return (
      <ChatArticle type={speaker} status={status} content={content}>
        <ChatArticle.Speech />
        <ChatArticle.Avatar src={user?.imageSrc} />
        <ChatArticle.RetryCancelSelector />
      </ChatArticle>
    );
  },
};
