import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SearchContextProvider } from '@/contexts/search-context'
import { WatchContextProvider } from '@/contexts/watch-context'
import { useRoutes } from '@/hooks/useRoutes'
import { useGetUserProfile } from '@/services/use-get-user-profile'
import { useQueryClient } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'

export function RootLayout() {
  const route = useRoutes()
  const { isSuccess, isError, isFetched, isFetching } = useGetUserProfile()
  const isLoginOrRegisterPage = route.isRegisterPage || route.isLoginPage

  const shouldRedirectToRegisterPage =
    !isLoginOrRegisterPage && isError && isFetched
  if (shouldRedirectToRegisterPage) {
    useQueryClient().clear()
    route.NavigateToRegisterPage()
  }

  const shouldRedirectToHomePage =
    isLoginOrRegisterPage && isSuccess && isFetched
  if (shouldRedirectToHomePage) {
    route.NavigateToHomePage()
  }

  if (isLoginOrRegisterPage) {
    return (
      <div className='relative bg-zinc-950 text-zinc-100 min-h-screen font-inter tracking-wider max-w-[1344px] mx-auto'>
        <Header />

        <main className='relative min-h-[100dvh] h-full animate-soften-render bg-[url(@/assets/bg-play-movies.webp)] bg-cover before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-zinc-950/80 after:bg-gradient-to-t after:from-50% after:from-zinc-950 after:to-transparent after:absolute after:bottom-0 left-0 after:w-full after:h-full'>
          <Outlet />
        </main>
      </div>
    )
  }

  if (isFetching) {
    return <div className='bg-zinc-950 min-h-dvh max-w-[1344px] mx-auto' />
  }

  return (
    <div className='relative bg-zinc-950 text-zinc-100 min-h-screen font-inter tracking-wider max-w-[1344px] mx-auto'>
      <SearchContextProvider>
        <Header hasAccount={isSuccess} />

        <main className='min-h-[calc(100vh-9rem)] h-full animate-soften-render'>
          <WatchContextProvider>
            <Outlet />
          </WatchContextProvider>
        </main>
      </SearchContextProvider>

      <Footer />
    </div>
  )
}
