import AppToast from "./_components/AppToast";
import AppAlertDialog from "./_components/AppAlertDialog";
import AppConfirmDialog from "./_components/AppConfirmDialog";
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
      <AppAlertDialog />
      <AppConfirmDialog />
    </>
  );
}
