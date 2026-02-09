import { Meta, StoryObj } from '@storybook/react-vite'
import { Error } from './error'

const ErrorMeta: Meta<typeof Error> = {
  title: 'Components/Error',
  component: Error,
  args: { message: 'Not found register page', styles: 'text-red-500' },
  parameters: { layout: 'screen' },
  argTypes: {
    message: {
      type: 'string',
      description: 'write your text message',
      table: { defaultValue: { summary: 'undefined' } },
    },
    styles: {
      description: 'insert your styles using tailwind classes',
      table: { defaultValue: { summary: 'undefined' } },
      type: 'string',
    },
  },
}

export default ErrorMeta
export const Default: StoryObj<typeof ErrorMeta> = {}
