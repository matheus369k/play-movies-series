import * as Dropdown from '@/components/ui/dropdown-menu'
import { Settings } from 'lucide-react'
import { EditProfileModel } from './components/edit-profile-model'
import { UserAvatar } from '@/components/user-avatar'
import { LogoutProfileModel } from './components/logout-profile-model'
import { useGetUserProfile } from '@/services/use-get-user-profile'
import { WatchLaterMovies } from './components/watch-later-movies'

export function Profile() {
  const { data: userProfile } = useGetUserProfile()

  return (
    <section className='pt-28 flex flex-col gap-16'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative size-fit rounded-full'>
          <div className='absolute bottom-2.5 right-2.5 space-y-2 z-10'>
            <Dropdown.DropdownMenu modal={false}>
              <Dropdown.DropdownMenuTrigger aria-label='setting' asChild>
                <Settings className='size-12 cursor-pointer' />
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
                  <EditProfileModel name={userProfile?.name} />
                </Dropdown.DropdownMenuItem>
              </Dropdown.DropdownMenuContent>
            </Dropdown.DropdownMenu>
          </div>

          <UserAvatar fontSize='lg' size='lg' />
        </div>
        <div className='text-base text-center font-normal text-zinc-200 space-y-1'>
          <p>
            <span className='font-semibold text-zinc-50'>Name: </span>
            {userProfile?.name || 'unknown'}
          </p>
          <p>
            <span className='font-semibold text-zinc-50'>Gmail: </span>
            {userProfile?.email || 'unknown'}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-4 h-max w-full'>
        <div className='border-b-2 border-zinc-900'>
          <span className='flex w-fit font-semibold px-6 py-2 bg-zinc-900 rounded-t-lg'>
            Watch later
          </span>
        </div>

        <WatchLaterMovies />
      </div>
    </section>
  )
}
