import AppToast from "@/_components/layout/AppToast";
import AppAlertDialog from "@/_components/layout/AppAlertDialog";
import AppConfirmDialog from "@/_components/layout/AppConfirmDialog";
import Header from "@/_components/layout/Header/Header";
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
