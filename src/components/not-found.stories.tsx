import { Meta, StoryObj } from '@storybook/react-vite'
import { NotFound } from './not-found'

const NotFoundMeta: Meta<typeof NotFound> = {
  title: 'Components/NotFound',
  component: NotFound,
  parameters: { layout: 'centered' },
  args: { text: 'Not found movie page!', code: 404 },
  argTypes: {
    code: {
      description: 'Code error',
      type: 'number',
      table: { defaultValue: { summary: '404' } },
    },
    text: {
      description: 'text for describe error',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
}

export default NotFoundMeta
export const Default: StoryObj<typeof NotFoundMeta> = {}
