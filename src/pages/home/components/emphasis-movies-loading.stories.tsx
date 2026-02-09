import { Meta, StoryObj } from '@storybook/react-vite'
import { EmphasisMoviesLoading } from './emphasis-movies-loading'

const EmphasisMoviesLoadingMeta: Meta<typeof EmphasisMoviesLoading> = {
  title: 'Pages/Home/Components/EmphasisMoviesLoading',
  component: EmphasisMoviesLoading,
  parameters: { layout: 'screen' },
}

export default EmphasisMoviesLoadingMeta
export const Default: StoryObj<typeof EmphasisMoviesLoadingMeta> = {}
