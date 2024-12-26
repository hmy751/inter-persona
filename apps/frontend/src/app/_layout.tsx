import ErrorToast from "./_components/ErrorToast";
import styles from "./_layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <>
      <div className={styles.wrapper}>{children}</div>
      <ErrorToast />
    </>
  );
}
