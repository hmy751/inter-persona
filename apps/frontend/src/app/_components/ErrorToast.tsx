"use client";

import { ReactNode, ReactElement } from "react";
import Toast from "@repo/ui/Toast";
import styles from "./ErrorToast.module.css";
import { useErrorToastStore } from "@/store/useErrorToastStore";

interface ErrorToastProps {}

export default function ErrorToast({}: ErrorToastProps): ReactElement {
  const isError = useErrorToastStore((state) => state.isError);
  const message = useErrorToastStore((state) => state.message);
  const setOpen = useErrorToastStore((state) => state.setOpen);

  return (
    <Toast.Provider duration={1000}>
      <Toast.Root open={isError} onOpenChange={setOpen}>
        <Toast.Title>에러</Toast.Title>
        <Toast.Description>{message}</Toast.Description>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}
