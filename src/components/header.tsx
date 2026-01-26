import { TopResetScroll } from '@/util/reset-scroll'
import { SearchForm } from './search-form'
import { LOGIN_USER, REGISTER_USER } from '@/util/consts'
import { Link } from 'react-router-dom'
import { useRoutes } from '@/hooks/useRoutes'
import { ChevronLeft } from 'lucide-react'
import { UserAvatar } from './user-avatar'

export function Header({ hasAccount = false }: { hasAccount?: boolean }) {
  const route = useRoutes()
  const isSearchOrMoreOrProfilePage =
    route.isMorePage || route.isSearchPage || route.isProfilePage
  const isHomeOrLoginOrRegisterPage =
    route.isRegisterPage || route.isLoginPage || route.isHomePage

  function handleRedirectMainPage() {
    route.NavigateToHomePage()
    TopResetScroll()
  }

  function handleNavigateToProfile() {
    route.NavigateToProfilePage()
  }

  function RenderNavbarUI() {
    if (hasAccount) {
      return (
        <div className='flex justify-end items-center w-full max-w-[400px] gap-4'>
          <SearchForm />
          <div
            onClick={handleNavigateToProfile}
            className='rounded-full cursor-pointer'
          >
            <UserAvatar />
          </div>
        </div>
      )
    }

    return (
      <nav className='flex gap-8'>
        <Link
          className={`text-lg ${route.isRegisterPage && 'text-zinc-500'}`}
          to={REGISTER_USER}
        >
          register
        </Link>
        <Link
          className={`text-lg ${route.isLoginPage && 'text-zinc-500'}`}
          to={LOGIN_USER}
        >
          login
        </Link>
      </nav>
    )
  }

  function RenderLogoUI() {
    if (isHomeOrLoginOrRegisterPage) {
      return (
        <button
          aria-label='logo of site'
          onClick={handleRedirectMainPage}
          className='flex items-center'
        >
          <i className='bg-[url(https://github.com/matheus369k/play-movies-series/blob/main/public/favicon.png?raw=true)] block rounded-md size-10 bg-cover z-50'></i>
          <h1 className='bg-zinc-900 py-0.5 px-2 pl-5 relative -left-3 rounded-r-lg border border-zinc-600 text-zinc-100 font-extrabold text-2xl uppercase'>
            Play
          </h1>
        </button>
      )
    }

    return (
      <button
        aria-label='back page'
        type='button'
        onClick={handleRedirectMainPage}
      >
        <ChevronLeft className='size-8' />
      </button>
    )
  }

  return (
    <header
      className={`top-0 left-0 w-full p-4 flex gap-1 justify-between items-center z-50 max-sm:p-2 animate-show-header ${
        isSearchOrMoreOrProfilePage ? 'fixed bg-zinc-950' : 'absolute'
      }`}
    >
      {RenderLogoUI()}
      {RenderNavbarUI()}
    </header>
  )
}
