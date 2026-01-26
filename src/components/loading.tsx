import { RiLoader3Line } from 'react-icons/ri'
import { twMerge } from 'tailwind-merge'

interface PropsLoading {
  message: string
  styles?: string
}

export function Loading({ message, styles }: PropsLoading) {
  return (
    <div className={twMerge('flex items-center gap-1 w-max mx-auto', styles)}>
      <RiLoader3Line className='size-12 animate-spin' />
      <h1 className='font-bold text-2xl'>{message}</h1>
    </div>
  )
}
