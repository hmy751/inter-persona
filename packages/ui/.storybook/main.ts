import type { StorybookConfig } from "@storybook/react-vite";
import baseConfig from "@repo/storybook-config/main";

const config: StorybookConfig = {
  ...baseConfig,
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {});
  },
};
export default config;
