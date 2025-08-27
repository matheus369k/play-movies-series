import { RouterProvider } from 'react-router-dom'
import { routes } from './router/app-router'
import { UserContextProvider } from './contexts/user-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={routes} />
      </UserContextProvider>
    </QueryClientProvider>
  )
}
