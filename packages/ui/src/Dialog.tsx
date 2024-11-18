import { ReactNode, ReactElement } from "react";
import styles from "./Dialog.module.css";
import * as D from "@radix-ui/react-dialog";

interface DialogProps {
  children: ReactNode;
}

export default function Dialog({ children }: DialogProps): ReactElement {
  return <D.Root>{children}</D.Root>;
}

Dialog.Content = ({ children }: { children: ReactNode }) => (
  <D.Portal>
    <D.Overlay className={styles.overlay} />
    <D.Content className={styles.content}>{children}</D.Content>
  </D.Portal>
);
Dialog.Trigger = ({ children }: { children: ReactNode }) => (
  <D.Trigger>{children}</D.Trigger>
);
Dialog.Title = ({ children }: { children: ReactNode }) => (
  <D.Title className={styles.title}>{children}</D.Title>
);
Dialog.Description = ({ children }: { children: ReactNode }) => (
  <D.Description className={styles.description}>{children}</D.Description>
);
