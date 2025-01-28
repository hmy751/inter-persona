"use client";

import { useAlertDialogStore } from "@repo/store/useAlertDialogStore";
import Dialog from "@repo/ui/Dialog";

export default function AppAlertDialog() {
  const { open, setOpen, title, description, clearAlert } =
    useAlertDialogStore();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
}
