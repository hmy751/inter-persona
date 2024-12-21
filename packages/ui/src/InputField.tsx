import styles from "./InputField.module.css";

interface InputFieldProps {
  children: React.ReactNode;
  label: string;
  elementHeight?: string;
  message?: string;
}

export default function InputField({
  children,
  label,
  message,
  elementHeight = "var(--space-10)",
}: InputFieldProps): React.ReactElement {
  return (
    <div className={styles.inputField}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.elementBox} style={{ height: elementHeight }}>
        {children}
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  );
}
