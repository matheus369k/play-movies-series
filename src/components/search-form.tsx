import { IoSearchOutline } from 'react-icons/io5'
import { SearchContext } from '@/contexts/search-context'
import { TopResetScroll } from '@/util/reset-scroll'
import { FormProvider, useForm } from 'react-hook-form'
import { useContext } from 'react'
import { FormFieldIcon, FormFieldInput, FormFieldRoot } from './form-field'
import { useRoutes } from '@/hooks/useRoutes'
import { Navigate } from 'react-router-dom'
import { REGISTER_USER } from '@/util/consts'
import { UserContext } from '@/contexts/user-context'

export interface UseFormType {
  search: string
}

export function SearchForm() {
  const { handleUpdateSearch } = useContext(SearchContext)
  const { user } = useContext(UserContext)
  const hookUseForm = useForm<UseFormType>({
    defaultValues: {
      search: '',
    },
  })
  const { handleSubmit, reset } = hookUseForm
  const { NavigateToSearchPage } = useRoutes()

  function handleSubmitSearchForm({ search }: UseFormType) {
    if (!user) return <Navigate to={REGISTER_USER} />

    handleUpdateSearch(search)
    TopResetScroll()
    reset()

    NavigateToSearchPage({ search, userId: user.id })
  }

  return (
    <FormProvider {...hookUseForm}>
      <form
        onSubmit={handleSubmit(handleSubmitSearchForm)}
        autoComplete='off'
        className='relative text-zinc-400'
      >
        <FormFieldRoot className='bg-zinc-200/20 backdrop-blur-sm'>
          <FormFieldInput
            aria-label='search'
            type='search'
            placeholder='Search...'
            fieldName='search'
            id='search'
          />
          <FormFieldIcon>
            <IoSearchOutline className='size-6 z-10' />
          </FormFieldIcon>
        </FormFieldRoot>
      </form>
    </FormProvider>
  )
}
