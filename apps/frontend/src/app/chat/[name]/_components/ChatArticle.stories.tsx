import type { Meta, StoryObj } from "@storybook/react";
import ChatArticle from "./ChatArticle";
import {
  ChatContentSpeakerType,
  ChatContentStatusType,
} from "@/store/redux/type";

const interviewer = {
  imgUrl: "/assets/images/elon_musk.png",
  name: "Elon Musk",
  description: "CEO of SpaceX, Tesla, and Neuralink",
};

const user = {
  imageSrc: "/assets/images/dev_profile.png",
};

const meta = {
  title: "Pages/Chat/ChatArticle",
  component: ChatArticle,
  parameters: {
    layout: "Desktop",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatArticle>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockInterviewerChatContent = {
  status: ChatContentStatusType.success,
  speaker: ChatContentSpeakerType.bot,
  content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
  timeStamp: new Date(),
};

export const InterviewerChat = {
  render: () => {
    const { status, speaker, content } = mockInterviewerChatContent;

    return (
      <ChatArticle type={speaker}>
        <ChatArticle.Avatar src={interviewer?.imgUrl} />
        <ChatArticle.Speech status={status} text={content} />
      </ChatArticle>
    );
  },
};

const mockLoadingInterviewerChatContent = {
  status: ChatContentStatusType.loading,
  speaker: ChatContentSpeakerType.bot,
  content: "",
  timeStamp: new Date(),
};

export const InterviewerChatWithLoading = {
  render: () => {
    const { status, speaker, content } = mockLoadingInterviewerChatContent;

    return (
      <ChatArticle type={speaker}>
        <ChatArticle.Avatar src={interviewer?.imgUrl} />
        <ChatArticle.Speech status={status} text={content} />
      </ChatArticle>
    );
  },
};

const mockUserChatContent = {
  status: ChatContentStatusType.success,
  speaker: ChatContentSpeakerType.user,
  content: "안녕하세요 개발자 입니다.",
  timeStamp: new Date(),
};

export const UserChat = {
  render: () => {
    const { status, speaker, content } = mockUserChatContent;

    return (
      <ChatArticle type={speaker}>
        <ChatArticle.Speech status={status} text={content} />
        <ChatArticle.Avatar src={user?.imageSrc} />
      </ChatArticle>
    );
  },
};

const mockLoadingUserChatContent = {
  status: ChatContentStatusType.loading,
  speaker: ChatContentSpeakerType.user,
  content: "",
  timeStamp: new Date(),
};

export const UserChatWithLoading = {
  render: () => {
    const { status, speaker, content } = mockLoadingUserChatContent;

    return (
      <ChatArticle type={speaker}>
        <ChatArticle.Speech status={status} text={content} />
        <ChatArticle.Avatar src={user?.imageSrc} />
      </ChatArticle>
    );
  },
};
