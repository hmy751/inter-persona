import baseConfig from '@repo/storybook-config/main';

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  ...baseConfig,
  stories: ['../src/_storybook/**/*.mdx', '../src/_storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],
};
export default config;
