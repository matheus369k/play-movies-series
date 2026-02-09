import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-styling-webpack',
    'msw-storybook-addon',
    '@storybook/addon-themes',
  ],
  staticDirs: ['../public'],
  framework: '@storybook/react-vite',
}
export default config
