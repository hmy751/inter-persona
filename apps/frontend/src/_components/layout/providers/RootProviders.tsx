import ReduxStoreProvider from './ReduxStoreProvider';
import QueryProviders from './QueryProvider';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProviders>
      <ReduxStoreProvider>{children}</ReduxStoreProvider>
    </QueryProviders>
  );
}
