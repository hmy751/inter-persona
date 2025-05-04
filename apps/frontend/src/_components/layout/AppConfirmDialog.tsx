'use client';

import { useConfirmDialogStore } from '@repo/store/useConfirmDialogStore';
import Dialog from '@repo/ui/Dialog';

export default function AppConfirmDialog() {
  const { open, setOpen, title, description, confirmCallback, clearConfirm } = useConfirmDialogStore();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <Dialog.Footer>
            <Dialog.Cancel callback={clearConfirm}>Cancel</Dialog.Cancel>
            <Dialog.Confirm callback={confirmCallback}>Confirm</Dialog.Confirm>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
