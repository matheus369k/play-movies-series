// components de display
import { SearchForm } from "./search-form";

// components logicos
import { HOME_ROUTE } from "@/router/path-routes";

// libs
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export interface UseFormType {
  search: string;
}

export function Header() {
  const { pathname } = useLocation();
  const hookForm = useForm<UseFormType>({
    defaultValues: {
      search: "",
    },
  });

  // Verificar se e a home page
  const currentPageIsHome =
    pathname === HOME_ROUTE || pathname === HOME_ROUTE + "/";

  return (
    <header
      className={`absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 max-sm:p-2 ${
        currentPageIsHome && "max-md:gap-6"
      }`}
    >
      <Link to={HOME_ROUTE} className="flex items-center">
        <i className="bg-[url(https://github.com/matheus369k/play-movies-series/blob/main/public/favicon.png?raw=true)] block size-10 bg-cover z-50"></i>
        <h1 className="bg-zinc-900 py-0.5 px-2 pl-5 relative -left-3 rounded-r-lg border border-zinc-600 text-zinc-100 font-extrabold text-2xl uppercase">
          Play
        </h1>
      </Link>
      <FormProvider {...hookForm}>
        <SearchForm currentPageIsHome={currentPageIsHome} />
      </FormProvider>
    </header>
  );
}
