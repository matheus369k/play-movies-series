// Components
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

// Contextos
import { SearchContextProvider } from "@/context/search-context";
import { WatchContextProvider } from "@/context/watch-context";

// libs
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

export function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
        <WatchContextProvider>
          <SearchContextProvider>
            <Header />
            <main className="min-h-[calc(100vh-9rem)] h-full">
              <Outlet />
            </main>
          </SearchContextProvider>
          <Footer />
        </WatchContextProvider>
      </div>
    </QueryClientProvider>
  );
}
