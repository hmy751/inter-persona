"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";

export default function Providers({
  theme,
  children,
  resetCSS,
}: {
  theme: Dict;
  children: React.ReactNode;
  resetCSS: boolean;
}) {
  return (
    <CacheProvider>
      <ChakraProvider resetCSS={resetCSS} theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
