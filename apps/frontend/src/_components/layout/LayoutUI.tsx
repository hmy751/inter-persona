'use client';

import Header from '@/_components/layout/Header/Header';
import styles from './LayoutUI.module.css';
import dynamic from 'next/dynamic';

const AppToast = dynamic(() => import('@/_components/layout/AppToast'), {
  ssr: false,
});
const AppAlertDialog = dynamic(() => import('@/_components/layout/AppAlertDialog'), { ssr: false });
const AppConfirmDialog = dynamic(() => import('@/_components/layout/AppConfirmDialog'), { ssr: false });

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
