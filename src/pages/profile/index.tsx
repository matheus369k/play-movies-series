import * as Dropdown from '@/components/ui/dropdown-menu'
import { UserContext } from '@/contexts/user-context'
import { useQuery } from '@tanstack/react-query'
import { Settings, Shredder } from 'lucide-react'
import { useContext } from 'react'
import { getWatchLaterMovies } from './services/get-watch-later-movies'
import { MovieCard } from '@/components/movie-card'
import { EditProfileModel } from './components/edit-profile-model'
import { UserAvatar } from '@/components/user-avatar'
import { LogoutProfileModel } from './components/logout-profile-model'

export function Profile() {
  const { user } = useContext(UserContext)
  const { data, isFetched } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ['watch-later'],
    queryFn: getWatchLaterMovies,
  })

  if (!user) {
    return null
  }

  return (
    <section className='pt-28 flex flex-col gap-16'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative size-fit rounded-full'>
          <div className='absolute top-2.5 left-2.5 space-y-2 z-10'>
            <Dropdown.DropdownMenu modal={false}>
              <Dropdown.DropdownMenuTrigger aria-label='setting' asChild>
                <Settings className='size-8 cursor-pointer' />
              </Dropdown.DropdownMenuTrigger>
              <Dropdown.DropdownMenuContent
                align='start'
                className='bg-zinc-900 border-zinc-700 text-zinc-50 px-4 py-2'
              >
                <Dropdown.DropdownMenuItem asChild>
                  <LogoutProfileModel />
                </Dropdown.DropdownMenuItem>

                <Dropdown.DropdownMenuSeparator className='bg-zinc-700' />

                <Dropdown.DropdownMenuItem asChild>
                  <EditProfileModel />
                </Dropdown.DropdownMenuItem>
              </Dropdown.DropdownMenuContent>
            </Dropdown.DropdownMenu>
          </div>

          <UserAvatar fontSize='lg' size='lg' />
        </div>
        <div className='text-base text-center font-normal text-zinc-200 space-y-1'>
          <p>
            <span className='font-semibold text-zinc-50'>Name: </span>
            {user.name}
          </p>
          <p>
            <span className='font-semibold text-zinc-50'>Gmail: </span>
            {user.email}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-4 h-max w-full'>
        <div className='border-b-2 border-zinc-900'>
          <span className='flex w-fit font-semibold px-6 py-2 bg-zinc-900 rounded-t-lg'>
            Watch later
          </span>
        </div>

        {!data && isFetched && (
          <div className='w-fit mx-auto' aria-label='empty watch later movies'>
            <Shredder strokeWidth={1} className='text-zinc-900 size-56' />
          </div>
        )}

        {!data && !isFetched && (
          <p
            aria-label='loading watch later movies'
            className='capitalize text-center justify-self-normal text-zinc-500'
          >
            loading...
          </p>
        )}

        {data && (
          <div aria-label='watch later movies' className='flex gap-4'>
            {data.watchLaterMedias.map((watchLaterMedia) => {
              return (
                <MovieCard
                  Poster={watchLaterMedia.image}
                  Title={watchLaterMedia.title}
                  Type={watchLaterMedia.type}
                  imdbID={watchLaterMedia.movieId}
                  Year={watchLaterMedia.release}
                  key={watchLaterMedia.id}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
