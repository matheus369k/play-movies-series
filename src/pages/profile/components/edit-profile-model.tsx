import * as Dialog from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  FormFieldIcon,
  FormFieldInput,
  FormFieldRoot,
} from '@/components/form-field'
import { Camera, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useState } from 'react'
import { useUpdateUserProfile } from '../services/use-update-profile'
import { z } from 'zod'
import { UserAvatar } from '@/components/user-avatar'

const FromUpdateProfileSchema = z.object({
  file: z.custom<FileList>().optional(),
  name: z
    .string()
    .min(3, 'name has min 3 letters')
    .max(100, 'name has max 100 letters'),
})

type FromUpdateProfileType = z.infer<typeof FromUpdateProfileSchema>

export function EditProfileModel({ name = '' }: { name?: string }) {
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile()
  const hookUseForm = useForm({
    resolver: zodResolver(FromUpdateProfileSchema),
    defaultValues: {
      file: undefined,
      name,
    },
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = hookUseForm
  const file = watch('file')?.[0]

  async function handleUpdateProfile(data: FromUpdateProfileType) {
    try {
      const file: Blob | null = data.file?.[0] || null
      await updateUserProfile({
        name: data.name,
        file,
      })
    } catch (error) {
      console.log(error)
      setError('name', {
        message:
          'Error try update profile details, please verify your data fields',
      })
    }
  }

  if (file) {
    const fileReader = new FileReader()
    fileReader.onload = function (event) {
      const fileUrl = event.target?.result
      if (typeof fileUrl === 'string') {
        setAvatarPreview(fileUrl)
      }
    }
    fileReader.readAsDataURL(file)
  }

  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger className='cursor-pointer w-full py-1 hover:bg-transparent hover:text-zinc-500'>
        edit profile
      </Dialog.DialogTrigger>
      <Dialog.DialogContent
        aria-describedby='camp to update user profile details'
        className='max-w-[400px] bg-zinc-900 text-zinc-50 border-none  flex flex-col gap-6'
      >
        <Dialog.DialogHeader>
          <Dialog.DialogTitle className='text-center'>
            Edit profile
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>

        <FormProvider {...hookUseForm}>
          <form
            className='space-y-6'
            onSubmit={handleSubmit(handleUpdateProfile)}
          >
            <div className='flex flex-col items-center gap-4'>
              <div
                data-is-error={!!errors.file}
                className='relative size-fit rounded-full data-[is-error=true]:border border-red-500'
              >
                <Camera className='absolute bottom-0 right-0 size-8 z-50' />

                <UserAvatar
                  size='md'
                  fontSize='md'
                  avatarPreview={avatarPreview}
                />

                <Label
                  className='absolute top-0 left-0 size-full rounded-full z-50 bg-transparent'
                  htmlFor='file'
                />
                <input
                  readOnly={isSubmitting}
                  className='hidden'
                  {...register('file')}
                  max={1}
                  multiple={false}
                  type='file'
                  id='file'
                  name='file'
                  placeholder='file'
                />
              </div>

              <FormFieldRoot isError={!!errors.name} className='w-full'>
                <FormFieldInput
                  readOnly={isSubmitting}
                  aria-label='name'
                  placeholder='Enter your name...'
                  type='text'
                  fieldName='name'
                  id='name'
                />
                <FormFieldIcon>
                  <UserRound />
                </FormFieldIcon>
              </FormFieldRoot>

              <div className='flex gap-4 w-full'>
                <Button
                  autoFocus
                  disabled={isSubmitting}
                  type='submit'
                  className='w-full px-12 py-2 bg-red-600 text-zinc-50 hover:bg-red-600 disabled:opacity-70'
                >
                  {isSubmitting ? 'saving...' : 'save'}
                </Button>
                <Dialog.DialogClose asChild>
                  <Button
                    aria-label='closed'
                    disabled={isSubmitting}
                    type='button'
                    className='w-full px-12 py-2 bg-transparent border-zinc-700 text-zinc-50 disabled:opacity-70'
                    variant={'outline'}
                  >
                    close
                  </Button>
                </Dialog.DialogClose>
              </div>
            </div>
          </form>
        </FormProvider>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}
