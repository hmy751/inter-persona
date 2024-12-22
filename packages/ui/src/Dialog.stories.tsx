import type { Meta, StoryObj } from "@storybook/react";
import Dialog from "@repo/ui/Dialog";
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

export const PrimaryExample: Story = {
  args: {
    children: <div></div>,
  },
  render: () => {
    return (
      <Dialog>
        <Dialog.Trigger>
          <Button>Trigger!</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog>
    );
  },
};
