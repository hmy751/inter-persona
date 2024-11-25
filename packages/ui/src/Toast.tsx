import { ReactNode, ReactElement } from "react";
import styles from "./Toast.module.css";
import * as T from "@radix-ui/react-toast";

interface ToastProps {
  title?: string;
  content?: string;
  children?: ReactNode;
}

export default function Toast({ children }: ToastProps): ReactElement {
  return <>{children}</>;
}

interface ProviderProps extends T.ToastProviderProps {
  children: ReactNode;
}
Toast.Provider = ({ children, ...restProps }: ProviderProps) => (
  <T.Provider {...restProps}>{children}</T.Provider>
);

interface RootProps extends T.ToastProps {
  children: ReactNode;
}
Toast.Root = ({ open, onOpenChange, children, ...restProps }: RootProps) => (
  <T.Root
    open={open}
    onOpenChange={onOpenChange}
    className={styles.root}
    {...restProps}
  >
    {children}
  </T.Root>
);

interface ViewportProps extends T.ToastViewportProps {}
Toast.Viewport = ({ ...restProps }: ViewportProps) => (
  <T.Viewport className={styles.viewport} {...restProps} />
);

Toast.Title = ({ children }: { children: ReactNode }) => (
  <T.Title className={styles.title}>{children}</T.Title>
);
Toast.Description = ({ children }: { children: ReactNode }) => (
  <T.Description className={styles.description}>{children}</T.Description>
);
