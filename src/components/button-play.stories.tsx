import { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonPlay } from './button-play'

const ButtonPlayMeta: Meta<typeof ButtonPlay> = {
  title: 'Components/ButtonPlay',
  component: ButtonPlay,
  decorators: (Story) => {
    return (
      <div className='relative group/play w-40 h-52 bg-zinc-600'>{Story()}</div>
    )
  },
  parameters: { layout: 'centered' },
  args: { visible: true, fluxDefault: false },
  argTypes: {
    visible: {
      type: 'boolean',
      description: 'Hidden element when receive props as true',
      options: [true, false],
      table: { defaultValue: { summary: 'true' } },
    },
    fluxDefault: {
      type: 'boolean',
      description: 'add absolute position when receive props as true',
      options: [true, false],
      table: { defaultValue: { summary: 'false' } },
    },
  },
}

export default ButtonPlayMeta
export const Default: StoryObj<typeof ButtonPlayMeta> = {}
