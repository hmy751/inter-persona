import ReduxStoreProvider from "./ReduxStoreProvider";
import QueryProviders from "./QueryProvider";

import ErrorToast from "../_components/ErrorToast";

export default function LayoutWithProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProviders>
      <ReduxStoreProvider>{children}</ReduxStoreProvider>
      <ErrorToast />
    </QueryProviders>
  );
}
