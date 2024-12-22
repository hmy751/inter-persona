import {
  ReactNode,
  ReactElement,
  useMemo,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Dialog.module.css";
import Text from "./Text";
interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface DialogProps {
  children: ReactNode;
}

const DialogContext = createContext<DialogContextType>({
  open: false,
  setOpen: () => {},
});

export default function Dialog({ children }: DialogProps): ReactElement {
  const [open, setOpen] = useState(false);

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

Dialog.Trigger = ({ children }: { children: ReactNode }) => {
  const { setOpen } = useContext(DialogContext);
  return <div onClick={() => setOpen(true)}>{children}</div>;
};

Dialog.Content = ({ children }: { children: ReactNode }) => {
  const { open, setOpen } = useContext(DialogContext);

  // ESC key 클로즈 용도로 이벤트 등록
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setOpen]);
  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.overlay} onClick={() => setOpen(false)} />
      <div className={styles.content}>{children}</div>
    </>,
    document.body
  );
};

Dialog.Title = ({ children }: { children: ReactNode }) => {
  return <Text as="h2">{children}</Text>;
};

Dialog.Description = ({ children }: { children: ReactNode }) => {
  return <Text as="p">{children}</Text>;
};
