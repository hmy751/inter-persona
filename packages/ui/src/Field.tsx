import styles from './Field.module.css';

interface FieldProps {
  children: React.ReactNode;
  label: string;
  elementHeight?: string;
  message?: string;
}

export default function Field({
  children,
  label,
  message,
  elementHeight = 'var(--space-10)',
}: FieldProps): React.ReactElement {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.elementBox} style={{ height: elementHeight }}>
        {children}
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  );
}
