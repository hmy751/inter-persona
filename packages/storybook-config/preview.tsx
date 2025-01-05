import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";

/** @type { import('@storybook/react').Preview } */
import "@repo/ui/styles/globals.css";

const customViewports = {
  mobile: {
    name: "Mobile",
    styles: {
      width: "375px",
      height: "667px",
    },
  },
  desktop: {
    name: "Desktop",
    styles: {
      width: "1440px",
      height: "900px",
    },
  },
};

const basicPreview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: "responsive",
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...customViewports,
      },
    },
  },
};

export default basicPreview;
