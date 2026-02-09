import { Meta, StoryObj } from '@storybook/react-vite'
import { CategorySectionLoading } from './category-section-loading'

const CategorySectionLoadingMeta: Meta<typeof CategorySectionLoading> = {
  title: 'Components/CategorySectionLoading',
  component: CategorySectionLoading,
  args: { title: 'Movies' },
  argTypes: {
    title: {
      description: 'Title that to going describe than movie section',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  decorators: (Story) => <div className='px-4'>{Story()}</div>,
  parameters: { layout: 'screen' },
}

export default CategorySectionLoadingMeta
export const Default: StoryObj<typeof CategorySectionLoadingMeta> = {}
