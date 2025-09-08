import {
  FormFieldIcon,
  FormFieldInput,
  FormFieldRoot,
} from '@/components/form-field'
import { Lock, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { loginUser } from './services/login-user'
import { JWT_USER_TOKEN } from '@/util/consts'
import { useRoutes } from '@/hooks/useRoutes'
import { useContext } from 'react'
import { UserContext } from '@/contexts/user-context'
import { formatter } from '@/util/formatter'
import cookie from 'js-cookie'

const LoginUserSchema = z.object({
  email: z.string().email('email is not valid'),
  password: z
    .string()
    .min(8, 'should have min 8 letter')
    .max(16, 'should have min 16 letter'),
})

type LoginUserFormType = z.infer<typeof LoginUserSchema>

export function LoginUser() {
  const hookUseForm = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const {
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = hookUseForm
  const { NavigateToHomePage } = useRoutes()
  const { setUserState } = useContext(UserContext)

  async function handleSubmittedLoginUser(user: LoginUserFormType) {
    const { email, password } = user

    try {
      const data = await loginUser({
        email,
        password,
      })

      if (!data) {
        throw new Error('Error try login user')
      }

      reset()
      cookie.set(JWT_USER_TOKEN, data.token)
      setUserState({
        ...data.user,
        avatar: formatter.mergeAvatarUrlWithBackUrl(data.user.avatar),
      })
      NavigateToHomePage(data.user.id)
    } catch (error) {
      console.log(error)
      setError('email', { message: 'email or password invalid' })
      setError('password', { message: 'email or password invalid' })
    }
  }

  return (
    <div className='relative z-10 h-dvh flex justify-center items-center'>
      <div className='max-w-[32.25rem] w-full py-8 px-4 flex flex-col gap-8'>
        <h2 className='w-full font-medium text-2xl text-center'>Login</h2>
        <Form {...hookUseForm}>
          <form
            onSubmit={handleSubmit(handleSubmittedLoginUser)}
            className='flex flex-col gap-8'
          >
            <div className='flex flex-col gap-4'>
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

            <button
              disabled={isSubmitting}
              className='text-zinc-50 font-semibold text-lg py-2 px-12 bg-red-600 w-full text-center rounded-lg disabled:cursor-not-allowed disabled:bg-red-500'
              type='submit'
            >
              {isSubmitting ? 'login...' : 'login'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}
