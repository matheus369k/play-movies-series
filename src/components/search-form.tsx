import { IoSearchOutline } from 'react-icons/io5'
import { SearchContext } from '@/context/search-context'
import { TopResetScroll } from '@/functions'
import { SEARCH_ROUTE } from '@/router/path-routes'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { formatter } from '@/util/formatter'

export interface UseFormType {
  search: string
}

export function SearchForm() {
  const { handleUpdateSearch } = useContext(SearchContext)
  const { handleSubmit, reset, register } = useForm<UseFormType>({
    defaultValues: {
      search: '',
    },
  })
  const navigate = useNavigate()

  function handleSubmitSearchForm({ search }: UseFormType) {
    navigate(SEARCH_ROUTE.replace(':search', formatter(search).formatterUrl()))
    handleUpdateSearch({ search })
    TopResetScroll()
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSearchForm)}
      autoComplete='off'
      className='relative text-gray-400 backdrop-blur-sm'
    >
      <label htmlFor='search'>
        <IoSearchOutline className='absolute top-1/2 left-2 -translate-y-1/2 size-8 z-10 max-sm:size-6' />
      </label>
      <input
        {...register('search')}
        className='bg-gray-200/20 text-gray-100 outline-none border border-gray-500 focus:border-gray-100 focus:outline-none placeholder:text-gray-400 w-full p-2 pl-12 rounded-full max-sm:text-sm max-sm:pl-10'
        type='search'
        placeholder='Search...'
      />
    </form>
  )
}
