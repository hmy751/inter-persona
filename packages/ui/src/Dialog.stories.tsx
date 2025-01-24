import type { Meta, StoryObj } from "@storybook/react";
import Dialog from "./Dialog";
import Button from "./Button";
import { useAlertDialogStore } from "@repo/store/useAlertDialogStore";

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
          <Dialog.Footer>
            <Dialog.Cancel>Ok</Dialog.Cancel>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  },
};

export const WithFooter: Story = {
  args: {
    children: <div></div>,
  },
  render: () => {
    const handleConfirm = () => {
      console.log("Confirm");
    };

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
          <Dialog.Footer>
            <Dialog.Cancel>Cancel</Dialog.Cancel>
            <Dialog.Confirm callback={handleConfirm}>Confirm</Dialog.Confirm>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  },
};

export const ControlledAlertDialog: Story = {
  args: {
    children: <div></div>,
  },
  render: () => {
    const { open, title, description, setAlert, clearAlert } =
      useAlertDialogStore();

    return (
      <>
        <Button onClick={() => setAlert("Error", "This is a Network Error")}>
          Set Alert
        </Button>
        <Dialog open={open}>
          <Dialog.Content>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
            <Dialog.Footer>
              <Dialog.Cancel callback={clearAlert}>Ok</Dialog.Cancel>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  },
};
