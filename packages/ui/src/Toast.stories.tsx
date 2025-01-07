import type { Meta, StoryObj } from "@storybook/react";
import Toast from "./Toast";
import useToastStore from "@repo/store/useToastStore";
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
  const addToast = useToastStore((state) => state.addToast);

  const showToast = () => {
    addToast({
      title: "Toast Title",
      description: "This is a toast message",
      duration: 3000,
    });
  };

  return (
    <>
      <Button onClick={showToast}>Show Toast</Button>
      <Toast />
    </>
  );
};

export const Primary: Story = {
  render: () => <ToastDemo />,
};
