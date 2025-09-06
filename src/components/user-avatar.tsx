import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import * as Avatar from './ui/avatar'
import { UserContext } from '@/contexts/user-context'

type UserAvatarProps = {
  avatarPreview?: string | null
  fontSize?: 'sm' | 'md' | 'lg'
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ avatarPreview, fontSize, size }: UserAvatarProps) {
  const { user } = useContext(UserContext)

  if (!user) return null

  const firstLetter = user.email.slice(0, 1)
  const AvatarVariants = tv({
    base: 'flex justify-center items-center border border-zinc-500 bg-zinc-900',
    variants: {
      size: {
        sm: 'size-10',
        md: 'size-28',
        lg: 'size-56',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  })
  const AvatarTextVariates = tv({
    base: 'uppercase font-sans bg-zinc-900',
    variants: {
      fontSize: {
        sm: 'text-2xl leading-none ',
        md: 'text-6xl leading-none ',
        lg: 'text-9xl leading-none ',
      },
    },
    defaultVariants: {
      fontSize: 'sm',
    },
  })
  return (
    <>
      {avatarPreview && (
        <Avatar.Avatar className={AvatarVariants({ size })}>
          <Avatar.AvatarImage
            src={avatarPreview}
            aria-label='preview avatar'
            alt={`avatar from user with name ${user.name}`}
          />

          <Avatar.AvatarFallback className={AvatarTextVariates({ fontSize })}>
            {firstLetter}
          </Avatar.AvatarFallback>
        </Avatar.Avatar>
      )}

      {!avatarPreview && user.avatar && (
        <Avatar.Avatar className={AvatarVariants({ size })}>
          <Avatar.AvatarImage
            src={user.avatar}
            aria-label='main avatar'
            alt={`avatar from user with name ${user.name}`}
          />
          <Avatar.AvatarFallback className={AvatarTextVariates({ fontSize })}>
            {firstLetter}
          </Avatar.AvatarFallback>
        </Avatar.Avatar>
      )}

      {!avatarPreview && !user.avatar && (
        <div
          aria-label='first letter avatar'
          className={twMerge(
            AvatarVariants({ size }),
            'text-zinc-50 rounded-full'
          )}
        >
          <i className={AvatarTextVariates({ fontSize })}>{firstLetter}</i>
        </div>
      )}
    </>
  )
}
