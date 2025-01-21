import { PaginationContextProvider } from "@/context/pagination-context";
import { WatchContextProvider } from "@/context/watch-context";
import { router } from "@/router/appRouter";
import { RouterProvider } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <WatchContextProvider>
        <PaginationContextProvider>
          <RouterProvider router={router} />
        </PaginationContextProvider>
      </WatchContextProvider>
    </div>
  );
}
