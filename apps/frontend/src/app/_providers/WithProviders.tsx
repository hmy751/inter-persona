import { ReactNode } from "react";

import ChakraProvider from "./ChakraProvider";
import ReduxStoreProvider from "./ReduxStoreProvider";
import QueryProviders from "./QueryProvider";
import { theme } from "@/styles/theme";

import ErrorToast from "../_components/ErrorToast";

export default function WithProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProviders>
      <ChakraProvider theme={theme} resetCSS={false}>
        <ReduxStoreProvider>{children}</ReduxStoreProvider>
        <ErrorToast />
      </ChakraProvider>
    </QueryProviders>
  );
}
