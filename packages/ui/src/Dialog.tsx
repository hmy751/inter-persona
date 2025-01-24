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
import Button from "./Button";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  controlled?: boolean;
}

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType>({
  open: false,
  setOpen: () => {},
  controlled: false,
});

export default function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: DialogProps): ReactElement {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = useMemo(() => {
    if (isControlled) {
      return onOpenChange || (() => {});
    }
    return setUncontrolledOpen;
  }, [isControlled, onOpenChange]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      controlled: isControlled,
    }),
    [open, setOpen, isControlled]
  );

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

Dialog.Footer = ({ children }: { children: ReactNode }) => {
  return <div className={styles.footer}>{children}</div>;
};

Dialog.Confirm = ({
  callback,
  children,
}: {
  callback: () => void;
  children: ReactNode;
}) => {
  const { setOpen } = useContext(DialogContext);
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    callback();
    setOpen(false);
  };

  return (
    <Button variant="primary" fullWidth={true} onClick={handleConfirm}>
      {children}
    </Button>
  );
};

Dialog.Cancel = ({ children }: { children: ReactNode }) => {
  const { setOpen } = useContext(DialogContext);

  return (
    <Button variant="outline" fullWidth={true} onClick={() => setOpen(false)}>
      {children}
    </Button>
  );
};
