import type { Meta, StoryObj } from "@storybook/react";
import Dialog from "@repo/ui/Dialog";

const meta = {
  title: "Common/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: { control: "color" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: "2xs",
    name: "eee",
  },
};
