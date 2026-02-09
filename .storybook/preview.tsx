import { withThemeByClassName } from '@storybook/addon-themes'
import { initialize, mswLoader } from 'msw-storybook-addon'
import type { Preview } from '@storybook/react-vite'
import 'react-multi-carousel/lib/styles.css'
import '../src/style/index.css'
import { themes } from 'storybook/theming'

initialize()

const decorators = [
  withThemeByClassName({
    themes: {
      dark: 'dark',
    },
    defaultTheme: 'dark',
    parentSelector: 'html',
  }),
]

const preview: Preview = {
  loaders: [mswLoader],
  tags: ['autodocs'],
  decorators,
  parameters: {
    docs: {
      theme: {
        ...themes.dark,
        textColor: '#f4f4f5',
        appContentBg: '#09090b',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
