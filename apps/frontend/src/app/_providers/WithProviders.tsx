import { ReactNode } from "react";

import ReduxStoreProvider from "./ReduxStoreProvider";
import QueryProviders from "./QueryProvider";

import ErrorToast from "../_components/ErrorToast";

export default function WithProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProviders>
      <ReduxStoreProvider>{children}</ReduxStoreProvider>
      <ErrorToast />
    </QueryProviders>
  );
}
