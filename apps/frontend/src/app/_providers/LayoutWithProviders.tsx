import Layout from "../_layout";

import ReduxStoreProvider from "./ReduxStoreProvider";
import QueryProviders from "./QueryProvider";

export default function LayoutWithProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProviders>
      <ReduxStoreProvider>
        <Layout>{children}</Layout>
      </ReduxStoreProvider>
    </QueryProviders>
  );
}
