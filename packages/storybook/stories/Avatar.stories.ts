import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "@repo/ui/Avatar";

const meta = {
  title: "Common/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: { control: "color" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    src: "/assets/images/elon_musk.png",
    size: "2xs",
    name: "eee",
  },
};
