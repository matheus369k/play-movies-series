import { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from './footer'

const FooterMeta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: { layout: 'screen' },
}

export default FooterMeta
export const Default: StoryObj<typeof FooterMeta> = {}
