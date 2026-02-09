import { Meta, StoryObj } from '@storybook/react-vite'
import { CardMovieLoading } from './movie-card-loading'

const MovieCardLoadingMeta: Meta<typeof CardMovieLoading> = {
  title: 'Components/MovieCardLoading',
  component: CardMovieLoading,
  parameters: { layout: 'centered' },
}

export default MovieCardLoadingMeta
export const Default: StoryObj<typeof MovieCardLoadingMeta> = {}
