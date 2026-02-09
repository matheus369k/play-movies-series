import { Meta, StoryObj } from '@storybook/react-vite'
import { Loading } from './loading'

const LoadingMeta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  parameters: { layout: 'centered' },
  args: { message: '', styles: '' },
  argTypes: {
    message: {
      type: 'string',
      description: 'message than to going describe situation',
      table: { defaultValue: { summary: 'undefined' } },
    },
    styles: {
      type: 'string',
      description: 'tailwind class or normal class than content css properly',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
}

export default LoadingMeta
export const Default: StoryObj<typeof LoadingMeta> = {}
export const WithMessage: StoryObj<typeof LoadingMeta> = {
  args: { message: 'Loading Imagens...', styles: '' },
}
export const WithCustomStyles: StoryObj<typeof LoadingMeta> = {
  args: {
    message: 'Loading Imagens...',
    styles: 'text-blue-600 flex-row-reverse',
  },
}
