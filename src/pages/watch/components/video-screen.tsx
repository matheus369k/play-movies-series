import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { ButtonPlay } from '@/components/button-play'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatter } from '@/util/formatter'
import { getAssessment } from '../services/get-assessment'
import { createAssessment } from '../services/create-assessment'
import { updateAssessment } from '../services/update-assessment'

export function VideoScreen({
  Title,
  movieId,
}: {
  Title: string
  movieId: string
}) {
  const queryClient = useQueryClient()
  const { data } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ['liked', 'unlike', movieId],
    queryFn: async () => await getAssessment(movieId),
  })

  async function handleLikeOrUnlikeMovie({
    liked,
    unlike,
  }: {
    liked: boolean
    unlike: boolean
  }) {
    try {
      if (data && !data.liked && !data.unlike) {
        await createAssessment({
          liked,
          movieId,
          unlike,
        })
      } else {
        await updateAssessment({
          liked,
          movieId,
          unlike,
        })
      }

      queryClient.invalidateQueries({
        queryKey: ['liked', 'unlike', movieId],
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='absolute top-0 left-0 w-full h-[400px] bg-[url(@/assets/bg-play-movies.webp)] bg-cover aspect-video overflow-hidden cursor-pointer group/play max-sm:h-[200px]'>
      <div className='w-full h-full relative flex items-end bg-gradient-to-b from-[#1b1a1fa4] to-zinc-950 m-auto p-4'>
        <ButtonPlay />

        <div className='mx-auto flex justify-between max-w-7xl w-full'>
          <h3 className='font-bold text-4xl transition-all text-nowrap text-ellipsis overflow-hidden'>
            {Title}
          </h3>

          <div className='flex gap-4'>
            <button
              data-liked={data?.liked}
              onClick={() =>
                handleLikeOrUnlikeMovie({
                  liked: true,
                  unlike: false,
                })
              }
              type='button'
              className='flex items-center gap-1 px-3 py-1 rounded text-xl font-semibold text-zinc-400 data-[liked=true]:text-zinc-50'
              aria-label='liked'
            >
              <AiOutlineLike className='text-2xl' />
              {formatter.formatterLikeOrUnlikeCount(data?.totalLiked || 0)}
            </button>

            <button
              data-unlike={data?.unlike}
              type='button'
              onClick={() =>
                handleLikeOrUnlikeMovie({
                  liked: false,
                  unlike: true,
                })
              }
              className='flex items-center gap-1 px-3 py-1 rounded  text-xl font-semibold text-zinc-400 data-[unlike=true]:text-zinc-50'
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
