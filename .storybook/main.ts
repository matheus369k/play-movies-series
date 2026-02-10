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
  env: (config) => ({
    ...config,
    VITE_API_OMDBAPI: 'https://www.mockomdbapi.com/',
    VITE_BACKEND_URL: 'http://localhost:3333',
    VITE_API_OMDBAPI_KEY: '12345678',
  }),
}
export default config
