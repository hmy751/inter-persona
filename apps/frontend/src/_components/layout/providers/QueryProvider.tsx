'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {},
  });
};

export default function QueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
