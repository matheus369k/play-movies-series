import { createContext, useState } from "react";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Home } from "./components/pages/home/homes";

interface TIdContext {
  imdbID?: string
  setImdbID?: React.Dispatch<React.SetStateAction<string>>;
}
export const IdContext = createContext<TIdContext>({});

export function App() {
  const [imdbID, setImdbID] = useState("");
  
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <IdContext.Provider value={{imdbID, setImdbID}}>
        <Header />
        <Home />
        <Footer />
      </IdContext.Provider>
    </div>
  )
}
