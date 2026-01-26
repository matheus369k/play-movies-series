import { IoSearchOutline } from 'react-icons/io5'
import { SearchContext } from '@/contexts/search-context'
import { TopResetScroll } from '@/util/reset-scroll'
import { FormProvider, useForm } from 'react-hook-form'
import { useContext } from 'react'
import { FormFieldIcon, FormFieldInput, FormFieldRoot } from './form-field'
import { useRoutes } from '@/hooks/useRoutes'

export interface UseFormType {
  search: string
}

export function SearchForm() {
  const { handleUpdateSearch } = useContext(SearchContext)
  const hookUseForm = useForm<UseFormType>({
    defaultValues: {
      search: '',
    },
  })
  const { handleSubmit, reset } = hookUseForm
  const route = useRoutes()

  function handleSubmitSearchForm({ search }: UseFormType) {
    reset()
    handleRedirectionSearchPage(search)
  }

  function handleRedirectionSearchPage(search: string) {
    handleUpdateSearch(search)
    TopResetScroll()

    route.NavigateToSearchPage({ search })
  }

  if (route.isSearchPage) {
    return (
      <FormProvider {...hookUseForm}>
        <form
          aria-label='search form'
          onSubmit={handleSubmit(handleSubmitSearchForm)}
          autoComplete='off'
          className='relative text-zinc-400 w-full'
        >
          <FormFieldRoot>
            <FormFieldInput
              aria-label='search'
              type='search'
              aria-controls='off'
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

  return (
    <button
      aria-label='btn redirection search page'
      onClick={() => handleRedirectionSearchPage('dragons')}
      className='size-fit bg-transparent'
    >
      <IoSearchOutline className='size-8 z-10' />
    </button>
  )
}
