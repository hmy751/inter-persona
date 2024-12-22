import type { Meta, StoryObj } from "@storybook/react";
import Dialog from "./Dialog";
import Button from "./Button";

const meta = {
  title: "Common/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: <div></div>,
  },
  render: () => {
    return (
      <Dialog>
        <Dialog.Trigger>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is a description of the dialog content.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog>
    );
  },
};
