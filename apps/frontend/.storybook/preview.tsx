import basicPreview from "@repo/storybook-config/preview";
import { Provider } from "react-redux";
import { makeStore } from "@/_store/redux/rootStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const store = makeStore();

const preview = {
  ...basicPreview,
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </Provider>
    ),
  ],
};

export default preview;
