import AppToast from "./_components/AppToast";
import Header from "./_components/Header/Header";
import styles from "./_layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
      <AppToast />
    </>
  );
}
