import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { ButtonPlay } from '@/components/button-play'
import { formatter } from '@/util/formatter'
import { useGetAssessment } from '../services/use-get-assessment'
import { useCreateAssessment } from '../services/use-create-assessment'
import { useUpdateAssessment } from '../services/use-update-assessment'

type VideoScreenProps = {
  Title: string
  movieId: string
}

type HandleLikeOrUnlikeMovieProps = {
  liked: boolean
  unlike: boolean
}

export function VideoScreen({ Title, movieId }: VideoScreenProps) {
  const { mutateAsync: createAssessment, isLoading: isLoadingCreate } =
    useCreateAssessment(movieId)
  const { mutateAsync: updateAssessment, isLoading: isLoadingUpdate } =
    useUpdateAssessment(movieId)
  const { data } = useGetAssessment(movieId)

  async function handleLikeOrUnlikeMovie(props: HandleLikeOrUnlikeMovieProps) {
    try {
      const { liked, unlike } = props
      const assessment = { liked, movieId, unlike }

      const isLikedAndUnlikeNotExist = data && !data.liked && !data.unlike
      if (isLikedAndUnlikeNotExist) {
        await createAssessment(assessment)
        return
      }

      await updateAssessment(assessment)
    } catch (error) {
      console.log(error)
    }
  }

  const isFetchingLikeOrUnlikeRequest = isLoadingUpdate || isLoadingCreate
  const disabledUnlikeButton = isFetchingLikeOrUnlikeRequest || data?.unlike
  const disabledLikeButton = isFetchingLikeOrUnlikeRequest || data?.liked
  return (
    <div className='absolute top-0 left-0 w-full h-[400px] bg-[url(@/assets/bg-play-movies.webp)] bg-cover aspect-video overflow-hidden cursor-pointer group/play max-sm:h-[200px]'>
      <div className='w-full h-full relative flex items-end bg-gradient-to-b from-[#1b1a1fa4] to-zinc-950 m-auto p-2'>
        <ButtonPlay visible />

        <div className='mx-auto flex items-center justify-between max-w-7xl w-full'>
          <h3 className='font-bold text-4xl transition-all text-nowrap text-ellipsis overflow-hidden max-md:text-xl'>
            {Title}
          </h3>

          <div className='flex gap-4 max-md:gap-1'>
            <button
              disabled={disabledLikeButton}
              data-liked={data?.liked}
              onClick={() =>
                handleLikeOrUnlikeMovie({
                  liked: true,
                  unlike: false,
                })
              }
              type='button'
              className='flex items-center gap-1 px-3 py-1 rounded text-xl font-semibold text-zinc-600 data-[liked=true]:text-zinc-50 max-md:px-1.5'
              aria-label='liked'
            >
              <AiOutlineLike className='text-2xl' />
              {formatter.formatterLikeOrUnlikeCount(data?.totalLiked || 0)}
            </button>

            <button
              disabled={disabledUnlikeButton}
              data-unlike={data?.unlike}
              type='button'
              onClick={() =>
                handleLikeOrUnlikeMovie({
                  liked: false,
                  unlike: true,
                })
              }
              className='flex items-center gap-1 px-3 py-1 rounded  text-xl font-semibold text-zinc-600 data-[unlike=true]:text-zinc-50 max-md:px-1.5'
              aria-label='unlike'
            >
              <AiOutlineDislike className='text-2xl' />
              {formatter.formatterLikeOrUnlikeCount(data?.totalUnlike || 0)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
