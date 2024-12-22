import type { Meta, StoryObj } from "@storybook/react";
import Toast, { useToast } from "./Toast";
import Button from "./Button";

const meta = {
  title: "Common/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  const { addToast } = useToast();

  const showToast = () => {
    addToast({
      title: "Toast Title",
      description: "This is a toast message",
      duration: 3000,
    });
  };

  return <Button onClick={showToast}>Show Toast</Button>;
};

export const Primary: Story = {
  args: {
    children: <ToastDemo />,
  },
  render: () => (
    <Toast>
      <ToastDemo />
    </Toast>
  ),
};
