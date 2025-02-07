import type { Meta, StoryObj } from "@storybook/react";
import HeaderUserInfo from "@/_components/layout/Header/HeaderUserInfo";
import useUserStore from "@/_store/zustand/useUserStore";

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
  title: "Pages/layout/HeaderUserInfo",
  component: HeaderUserInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderUserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {},
  decorators: [withMockStore],
};

export const LongUserName: Story = {
  decorators: [
    (Story) => {
      useUserStore.setState({
        user: {
          ...mockUser,
          name: "Very Long User Name That Might Break Layout",
        },
      });
      return <Story />;
    },
  ],
};

export const NoImage: Story = {
  decorators: [
    (Story) => {
      useUserStore.setState({
        user: {
          ...mockUser,
          imageSrc: "",
        },
      });
      return <Story />;
    },
  ],
};

export const LoggedOut: Story = {
  decorators: [
    (Story) => {
      useUserStore.setState({ user: null });
      return <Story />;
    },
  ],
};
