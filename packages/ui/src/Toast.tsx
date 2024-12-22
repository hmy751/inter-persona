import {
  ReactNode,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";
import Text from "./Text";
interface ToastProps {
  children: ReactNode;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
}

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

export default function Toast({ children }: ToastProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className={styles.viewport}>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              {...toast}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({
  title,
  description,
  duration = 5000,
  onRemove,
}: ToastData & { onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [duration, onRemove]);

  return (
    <div className={styles.root}>
      {title && (
        <Text size="md" weight="medium" className={styles.title}>
          {title}
        </Text>
      )}
      {description && (
        <Text size="sm" weight="normal">
          {description}
        </Text>
      )}
    </div>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
