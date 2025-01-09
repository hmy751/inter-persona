import type { Meta, StoryObj } from "@storybook/react";
import ChatSection from "./ChatSection";
import {
  ChatContentSpeakerType,
  ChatContentStatusType,
} from "@/store/redux/type";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useInterviewerStore } from "@/store/useInterviewerStore";
import useUserStore from "@/store/useUserStore";
import chatReducer from "@/store/redux/features/chat/slice";

const mockInterviewer = {
  id: 1,
  imgUrl: "/assets/images/elon_musk.png",
  name: "Elon Musk",
  description: "CEO of SpaceX, Tesla, and Neuralink",
  mbti: "INTJ",
};

const mockUser = {
  id: 1,
  imageSrc: "/assets/images/dev_profile.png",
  name: "User",
};

const mockInterviewerChatContent = {
  status: ChatContentStatusType.success,
  speaker: ChatContentSpeakerType.bot,
  content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
  timeStamp: new Date(),
};

const mockLoadingInterviewerChatContent = {
  status: ChatContentStatusType.loading,
  speaker: ChatContentSpeakerType.bot,
  content: "",
  timeStamp: new Date(),
};

const mockUserChatContent = {
  status: ChatContentStatusType.success,
  speaker: ChatContentSpeakerType.user,
  content: "안녕하세요 개발자 입니다.",
  timeStamp: new Date(),
};

const mockLoadingUserChatContent = {
  status: ChatContentStatusType.loading,
  speaker: ChatContentSpeakerType.user,
  content: "",
  timeStamp: new Date(),
};

const mockUserChatContentWithInterviewerError = {
  status: ChatContentStatusType.fail,
  speaker: ChatContentSpeakerType.user,
  content: "안녕하세요 개발자 입니다.",
  timeStamp: new Date(),
};

const withMockStore = (
  Story: React.ComponentType,
  contents: any[] = [mockInterviewerChatContent]
) => {
  const store = configureStore({
    reducer: {
      chat: chatReducer,
    },
    preloadedState: {
      chat: {
        id: 1,
        contents,
        trySpeechCount: 0,
        isAIResponseError: false,
      },
    },
  });

  useInterviewerStore.setState({ interviewer: mockInterviewer });
  useUserStore.setState({ user: mockUser });

  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

const meta = {
  title: "Pages/Chat/ChatSection",
  component: ChatSection,
  parameters: {
    layout: "Desktop",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    interviewerImg: mockInterviewer.imgUrl,
    userImg: mockUser.imageSrc,
  },
  decorators: [
    (Story) =>
      withMockStore(Story, [mockInterviewerChatContent, mockUserChatContent]),
  ],
};

export const WithLoadingUserChat: Story = {
  args: {
    interviewerImg: mockInterviewer.imgUrl,
    userImg: mockUser.imageSrc,
  },
  decorators: [
    (Story) =>
      withMockStore(Story, [
        mockInterviewerChatContent,
        mockLoadingUserChatContent,
      ]),
  ],
};

export const WithLoadingInterviewer: Story = {
  args: {
    interviewerImg: mockInterviewer.imgUrl,
    userImg: mockUser.imageSrc,
  },
  decorators: [
    (Story) =>
      withMockStore(Story, [
        mockInterviewerChatContent,
        mockUserChatContent,
        mockLoadingInterviewerChatContent,
      ]),
  ],
};

export const WithInterviewerChatError: Story = {
  args: {
    interviewerImg: mockInterviewer.imgUrl,
    userImg: mockUser.imageSrc,
  },
  decorators: [
    (Story) => (
      <div style={{ height: "200px" }}>
        <Story />
      </div>
    ),
    (Story) =>
      withMockStore(Story, [
        mockInterviewerChatContent,
        mockUserChatContentWithInterviewerError,
      ]),
  ],
};