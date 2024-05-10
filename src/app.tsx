import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Home } from "./components/pages/home/homes";

export function App() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <Header />
      <Home />
      <Footer />
    </div>
  )
}
