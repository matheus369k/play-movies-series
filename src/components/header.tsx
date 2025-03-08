// components de display
import { TopResetScroll } from "@/functions";
import { SearchForm } from "./search-form";

// components logicos
import { HOME_ROUTE, MORE_ROUTE, SEARCH_ROUTE } from "@/router/path-routes";

// libs
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

export interface UseFormType {
  search: string;
}

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hookForm = useForm<UseFormType>({
    defaultValues: {
      search: "",
    },
  });

  // Voltar para home page
  function handleRedirectMainPage() {
    TopResetScroll();

    navigate(HOME_ROUTE);
  }

  // Verificar se estar na pagina de pesquisa ou mais
  const isSearchOrMore =
    pathname.includes(MORE_ROUTE) ||
    pathname.includes(SEARCH_ROUTE.split(":search")[0]);

  return (
    <header
      className={`top-0 left-0 w-full p-4 flex justify-between items-center z-50 max-sm:p-2 animate-show-header ${
        isSearchOrMore ? "fixed bg-gray-950" : "absolute"
      }`}
    >
      <button onClick={handleRedirectMainPage} className="flex items-center">
        <i className="bg-[url(https://github.com/matheus369k/play-movies-series/blob/main/public/favicon.png?raw=true)] block rounded-md size-10 bg-cover z-50"></i>
        <h1 className="bg-zinc-900 py-0.5 px-2 pl-5 relative -left-3 rounded-r-lg border border-zinc-600 text-zinc-100 font-extrabold text-2xl uppercase">
          Play
        </h1>
      </button>
      <FormProvider {...hookForm}>
        <SearchForm />
      </FormProvider>
    </header>
  );
}
