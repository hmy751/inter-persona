import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import useUserStore from "@/store/useUserStore";

const mockUser = {
  id: 1,
  name: "user",
  imageSrc: "/assets/images/dev_profile.png",
};

const withMockStore = (Story: React.ComponentType) => {
  useUserStore.setState({ user: mockUser });

  return <Story />;
};

const meta = {
  title: "Pages/layout/Header",
  component: Header,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        back: () => console.log("Back button clicked"),
        push: () => console.log("Router push called"),
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {},
  decorators: [withMockStore],
};

export const LoggedOut: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => {
      useUserStore.setState({ user: null });

      return <Story />;
    },
  ],
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile",
    },
  },
  decorators: [withMockStore],
};
