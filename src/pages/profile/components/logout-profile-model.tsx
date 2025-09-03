import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import { UserContext } from '@/contexts/user-context'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'
import { useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'

export function LogoutProfileModel() {
  const queryClient = useQueryClient()
  const { resetUserState } = useContext(UserContext)

  function handleLogoutUser() {
    cookiesStorage.delete(JWT_USER_TOKEN)
    resetUserState()
    queryClient.clear()
    window.location.reload()
  }

  return (
    <Dialog.Dialog modal={false}>
      <Dialog.DialogTrigger
        aria-label='logout'
        className='cursor-pointer py-1 hover:bg-transparent hover:text-zinc-500'
      >
        logout
      </Dialog.DialogTrigger>
      <Dialog.DialogContent className='max-w-[400px] bg-zinc-900 text-zinc-50 border-none'>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle className='text-base text-center font-normal'>
            Are you sure you want to log out of your current account?
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>
        <Dialog.DialogFooter>
          <Dialog.DialogClose aria-label='confirm logout' asChild>
            <Button
              onClick={handleLogoutUser}
              className='w-full px-12 py-2 bg-red-600 text-zinc-50 hover:bg-red-600'
            >
              confirm
            </Button>
          </Dialog.DialogClose>
          <Dialog.DialogClose aria-label='cancel logout' asChild>
            <Button
              className='w-full px-12 py-2 bg-transparent border-zinc-700 text-zinc-50'
              variant={'outline'}
            >
              close
            </Button>
          </Dialog.DialogClose>
        </Dialog.DialogFooter>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}
