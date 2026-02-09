import { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonSwitch } from './button-switch'
import { GrPrevious } from 'react-icons/gr'

const ButtonSwitchMeta: Meta<typeof ButtonSwitch> = {
  title: 'Pages/Home/Components/ButtonSwitch',
  component: ButtonSwitch,
  args: { children: <GrPrevious className='w-11 h-auto max-sm:size-8' /> },
  parameters: { layout: 'centered' },
  argTypes: {
    children: {
      control: { disable: true },
      table: { defaultValue: { summary: 'undefined' } },
      description: 'wrapper icon/text',
    },
  },
}

export default ButtonSwitchMeta
export const Default: StoryObj<typeof ButtonSwitchMeta> = {}
