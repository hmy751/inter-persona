import ErrorToast from "./_components/ErrorToast";
import Header from "./_components/Header/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <>
      <Header />
      {children}
      <ErrorToast />
    </>
  );
}
