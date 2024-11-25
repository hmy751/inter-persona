import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Toast from "@repo/ui/Toast";
import Button from "@repo/ui/Button";

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

export const PrimaryExample: Story = {
  args: {
    children: <div></div>,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>click</Button>
        <Toast.Provider duration={1000}>
          <Toast.Root open={open} onOpenChange={setOpen}>
            <Toast.Title>Title</Toast.Title>
            <Toast.Description>Content</Toast.Description>
          </Toast.Root>
          <Toast.Viewport />
        </Toast.Provider>
      </>
    );
  },
};
