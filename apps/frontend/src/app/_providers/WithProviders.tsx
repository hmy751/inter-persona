import { ReactNode } from "react";

import AudioPlayer from "@/components/AudioPlayer";

import ChakraProvider from "./ChakraProvider";
import ReduxStoreProvider from "./ReduxStoreProvider";
import QueryProviders from "./QueryProvider";
import { theme } from "@/styles/theme";

export default function WithProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProviders>
      <ChakraProvider theme={theme} resetCSS={false}>
        <ReduxStoreProvider>{children}</ReduxStoreProvider>
        <AudioPlayer />
      </ChakraProvider>
    </QueryProviders>
  );
}
