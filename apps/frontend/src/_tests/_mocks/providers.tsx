import React, { PropsWithChildren } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/_components/layout/providers/QueryProvider';
import { makeStore } from '@/_store/redux/rootStore';
import type { AppStore, RootState } from '@/_store/redux/rootStore';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  queryClient?: QueryClient;
  spyOnDispatch?: boolean;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = makeStore(preloadedState),
    queryClient = createQueryClient(),
    spyOnDispatch = false,
    ...renderOptions
  }: ExtendedRenderOptions = {}
): RenderResult & {
  store: AppStore;
  queryClient: QueryClient;
  dispatchSpy?: jest.SpyInstance;
} {
  const dispatchSpy = spyOnDispatch ? jest.spyOn(store, 'dispatch') : undefined;

  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    );
  }

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...renderResult,
    store,
    queryClient,
    dispatchSpy,
  };
}
