import { TopResetScroll } from '@/util/reset-scroll'
import { SearchForm } from './search-form'
import { JWT_USER_TOKEN, LOGIN_USER, REGISTER_USER } from '@/util/consts'
import { Link, Navigate } from 'react-router-dom'
import { getUserProfile } from '@/services/get-user-profile'
import { useRoutes } from '@/hooks/useRoutes'
import { useContext, useEffect } from 'react'
import { UserContext } from '@/contexts/user-context'
import { cookiesStorage } from '@/util/browser-storage'
import { formatter } from '@/util/formatter'

export function Header() {
  const {
    isLoginPage,
    isRegisterPage,
    isMorePage,
    isSearchPage,
    NavigateToHomePage,
    NavigateToRegisterPage,
  } = useRoutes()
  const isRegisterOrLoginPage = isLoginPage || isRegisterPage
  const isSearchOrMorePage = isMorePage || isSearchPage
  const { user, setUserState } = useContext(UserContext)

  function handleRedirectMainPage() {
    if (!user) return <Navigate to={REGISTER_USER} />
    TopResetScroll()
    NavigateToHomePage(user.id)
  }

  async function AutoLoginUser() {
    const token = cookiesStorage.get(JWT_USER_TOKEN)
    if (!token && user) return

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
    AutoLoginUser()
  }, [])

  return (
    <header
      className={`top-0 left-0 w-full p-4 flex justify-between items-center z-50 max-sm:p-2 animate-show-header ${
        isSearchOrMorePage ? 'fixed bg-zinc-950' : 'absolute'
      }`}
    >
      <button onClick={handleRedirectMainPage} className='flex items-center'>
        <i className='bg-[url(https://github.com/matheus369k/play-movies-series/blob/main/public/favicon.png?raw=true)] block rounded-md size-10 bg-cover z-50'></i>
        <h1 className='bg-zinc-900 py-0.5 px-2 pl-5 relative -left-3 rounded-r-lg border border-zinc-600 text-zinc-100 font-extrabold text-2xl uppercase'>
          Play
        </h1>
      </button>

      {user ? (
        <div className='flex gap-4'>
          <SearchForm />
          <div className='w-10 h-10 rounded-full cursor-pointer'>
            {user.avatar ? (
              <img
                className='object-cover rounded-full'
                src={user.avatar}
                alt=''
              />
            ) : (
              <div className='flex justify-center items-center w-full h-full bg-red-600 text-zinc-50 rounded-full'>
                <i className='uppercase text-2xl font-sans'>
                  {user.email.slice(0, 1)}
                </i>
              </div>
            )}
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
