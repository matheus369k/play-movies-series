import {
  FormFieldIcon,
  FormFieldInput,
  FormFieldRoot,
} from '@/components/form-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Lock, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useCreateUser } from './services/use-create-user'
import { useRoutes } from '@/hooks/useRoutes'

const RegisterUserSchema = z.object({
  name: z.string().min(3, 'should have min 3 letter'),
  email: z.string().email('email is not valid'),
  password: z
    .string()
    .min(8, 'should have min 8 letter')
    .max(16, 'should have min 16 letter'),
  agree_term: z.boolean(),
})

type RegisterUserFormType = z.infer<typeof RegisterUserSchema>

export function RegisterUser() {
  const hookUseForm = useForm({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      agree_term: true,
    },
  })
  const {
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = hookUseForm
  const { NavigateToHomePage } = useRoutes()
  const { mutateAsync: createUser } = useCreateUser()

  async function handleSubmittedRegisterUser(user: RegisterUserFormType) {
    const { agree_term, email, name, password } = user
    if (!agree_term) return

    try {
      await createUser({
        email,
        name,
        password,
      })

      reset()
      NavigateToHomePage()
    } catch (error) {
      console.log(error)
      setError('name', { message: 'error try register...' })
      setError('email', { message: 'error try register...' })
      setError('password', { message: 'error try register...' })
    }
  }

  return (
    <div className='relative z-10 h-dvh flex justify-center items-center'>
      <div className='max-w-[32.25rem] w-full py-8 px-4 flex flex-col gap-8'>
        <h2 className='w-full font-medium text-2xl text-center'>Register</h2>
        <Form {...hookUseForm}>
          <form
            onSubmit={handleSubmit(handleSubmittedRegisterUser)}
            className='flex flex-col gap-8'
          >
            <div className='flex flex-col gap-4'>
              <FormFieldRoot isError={!!errors.name}>
                <FormFieldInput
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

              <FormFieldRoot isError={!!errors.email}>
                <FormFieldInput
                  aria-label='email'
                  placeholder='Enter your email...'
                  type='text'
                  fieldName='email'
                  id='email'
                />
                <FormFieldIcon>
                  <Mail />
                </FormFieldIcon>
              </FormFieldRoot>

              <FormFieldRoot isError={!!errors.password}>
                <FormFieldInput
                  aria-label='password'
                  placeholder='Enter your password...'
                  type='password'
                  fieldName='password'
                  id='password'
                />
                <FormFieldIcon>
                  <Lock />
                </FormFieldIcon>
              </FormFieldRoot>
            </div>

            <FormField
              name='agree_term'
              control={hookUseForm.control}
              render={({ field }) => (
                <FormItem className='flex gap-2 items-center space-y-0'>
                  <FormControl>
                    <Checkbox
                      className='border-zinc-500 data-[state=checked]:text-zinc-50 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600'
                      checked={field.value}
                      onCheckedChange={() => field.onChange(!field.value)}
                    />
                  </FormControl>
                  <FormLabel htmlFor='agree_term' className='text-xs'>
                    By selecting, you agree to our{' '}
                    <span className='font-semibold underline cursor-pointer'>
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className='font-semibold underline cursor-pointer'>
                      Privacy Policy
                    </span>
                    .
                  </FormLabel>
                </FormItem>
              )}
            />

            <button
              disabled={isSubmitting}
              className='text-zinc-50 font-semibold text-lg py-2 px-12 bg-red-600 w-full text-center rounded-lg disabled:cursor-not-allowed disabled:bg-red-500'
              type='submit'
            >
              {isSubmitting ? 'registering...' : 'register'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}
