import baseConfig from "@repo/storybook-config";

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  ...baseConfig,
  staticDirs: ["../public"],
};
export default config;
