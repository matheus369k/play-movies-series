import { TopResetScroll } from '@/util/reset-scroll'
import { SearchForm } from './search-form'
import { JWT_USER_TOKEN, LOGIN_USER, REGISTER_USER } from '@/util/consts'
import { Link } from 'react-router-dom'
import { getUserProfile } from '@/services/get-user-profile'
import { useRoutes } from '@/hooks/useRoutes'
import { useContext, useEffect } from 'react'
import { UserContext } from '@/contexts/user-context'
import { cookiesStorage } from '@/util/browser-storage'
import { formatter } from '@/util/formatter'
import { ChevronLeft } from 'lucide-react'
import { UserAvatar } from './user-avatar'
import { AxiosBackApi } from '@/util/axios'

export function Header() {
  const {
    isLoginPage,
    isRegisterPage,
    isMorePage,
    isSearchPage,
    isProfilePage,
    NavigateToHomePage,
    NavigateToRegisterPage,
    isHomePage,
    NavigateToProfilePage,
  } = useRoutes()
  const isRegisterOrLoginPage = isLoginPage || isRegisterPage
  const isSearchOrMoreOrProfilePage =
    isMorePage || isSearchPage || isProfilePage
  const isHomeOrLoginOrRegisterPage =
    isRegisterPage || isLoginPage || isHomePage
  const { user, setUserState } = useContext(UserContext)

  function handleRedirectMainPage() {
    if (!user) return NavigateToRegisterPage()

    NavigateToHomePage(user.id)
    TopResetScroll()
  }

  function handleNavigateToProfile() {
    if (!user) return NavigateToRegisterPage()

    NavigateToProfilePage(user.id)
  }

  async function AutoLoginUser() {
    if (user) return

    const data = await getUserProfile()
    if (!data) {
      cookiesStorage.delete(JWT_USER_TOKEN)
      NavigateToRegisterPage()
      return
    }

    setUserState({
      ...data.user,
      avatar: formatter.mergeAvatarUrlWithBackUrl(data.user.avatar),
    })
    if (isRegisterOrLoginPage) {
      NavigateToHomePage(data.user.id)
    }
  }

  useEffect(() => {
    const token = cookiesStorage.get(JWT_USER_TOKEN)

    if (token) {
      AutoLoginUser()
    }

    if (!token) {
      AxiosBackApi.get('/hearth').then(() => {
        console.log('ok')
      })
    }
  }, [])

  return (
    <header
      className={`top-0 left-0 w-full p-4 flex justify-between items-center z-50 max-sm:p-2 animate-show-header ${
        isSearchOrMoreOrProfilePage ? 'fixed bg-zinc-950' : 'absolute'
      }`}
    >
      {isHomeOrLoginOrRegisterPage ? (
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
      ) : (
        <button
          aria-label='back page'
          type='button'
          onClick={handleRedirectMainPage}
        >
          <ChevronLeft className='size-8' />
        </button>
      )}

      {user ? (
        <div className='flex justify-end items-center w-full max-w-[400px] gap-4'>
          <SearchForm />
          <div
            onClick={handleNavigateToProfile}
            className='rounded-full cursor-pointer'
          >
            <UserAvatar />
          </div>
        </div>
      ) : (
        <nav className='flex gap-8'>
          <Link
            className={`text-lg ${isRegisterPage && 'text-zinc-500'}`}
            to={REGISTER_USER}
          >
            register
          </Link>
          <Link
            className={`text-lg ${isLoginPage && 'text-zinc-500'}`}
            to={LOGIN_USER}
          >
            login
          </Link>
        </nav>
      )}
    </header>
  )
}
