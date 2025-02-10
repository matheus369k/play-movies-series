import { SEARCH_ROUTE } from "@/router/path-routes";
import { createContext, useState } from "react";

interface SearchContextType {
  search: string;
  handleUpdateSearch: (props: { search: string }) => void;
  handleResetContext: () => void;
}

export const SearchContext = createContext({} as SearchContextType);

export function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState(() => {
    const pathName = window.location.pathname;

    if (pathName === SEARCH_ROUTE || pathName === SEARCH_ROUTE + "/") {
      return getUrlParams("search")?.replace("+", " ") || "one";
    }

    return "one";
  });

  function getUrlParams(nameParams: string) {
    const url = new URL(window.location.toString());
    return url.searchParams.get(nameParams);
  }

  function handleUpdateSearch({ search }: { search: string }) {
    setSearch(search);
  }

  function handleResetContext() {
    setSearch("one");
  }

  return (
    <SearchContext.Provider
      value={{ search, handleUpdateSearch, handleResetContext }}
    >
      {children}
    </SearchContext.Provider>
  );
}
