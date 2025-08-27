import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SearchContextProvider } from '@/contexts/search-context'
import { WatchContextProvider } from '@/contexts/watch-context'
import { useRoutes } from '@/hooks/useRoutes'
import { Outlet } from 'react-router-dom'

export function RootLayout() {
  const { isLoginPage, isRegisterPage } = useRoutes()
  const isLoginOrRegisterPage = isLoginPage || isRegisterPage

  return (
    <div className='bg-zinc-950 text-zinc-100 min-h-screen font-inter tracking-wider'>
      <WatchContextProvider>
        <SearchContextProvider>
          <Header />

          {isLoginOrRegisterPage ? (
            <main className='relative min-h-[100dvh] h-full animate-soften-render bg-[url(@/assets/bg-play-movies.webp)] bg-cover before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-zinc-950/80 after:bg-gradient-to-t after:from-50% after:from-zinc-950 after:to-transparent after:absolute after:bottom-0 left-0 after:w-full after:h-full'>
              <Outlet />
            </main>
          ) : (
            <>
              <main className='min-h-[calc(100vh-9rem)] h-full animate-soften-render'>
                <Outlet />
              </main>
              <Footer />
            </>
          )}
        </SearchContextProvider>
      </WatchContextProvider>
    </div>
  )
}
