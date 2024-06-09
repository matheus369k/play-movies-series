import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";
import { PaginationContextProvider } from "./context/pagination-context";
import { WatchContextProvider } from "./context/watch-context";

export function App() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <WatchContextProvider>
        <PaginationContextProvider>
          <RouterProvider router={router} />
        </PaginationContextProvider>
      </WatchContextProvider>
    </div>
  )
}
