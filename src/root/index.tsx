import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { PaginationContextProvider } from "@/context/pagination-context";
import { WatchContextProvider } from "@/context/watch-context";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <WatchContextProvider>
        <PaginationContextProvider>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </PaginationContextProvider>
      </WatchContextProvider>
    </div>
  );
}
