import { GrPrevious } from "react-icons/gr";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { PaginationContext } from "@/context/pagination-context";
import { WatchContext } from "@/context/watch-context";
import { HOME_ROUTE } from "@/router/path-routes";
import { FormProvider, useForm } from "react-hook-form";
import { SearchForm } from "./search-form";
import { BiPlayCircle } from "react-icons/bi";
import { Link } from "react-router-dom";

export interface UseFormType {
  search: string;
}

export function Header() {
  const { handleRemoveData } = useContext(PaginationContext);
  const { handleResetData } = useContext(WatchContext);
  const hookForm = useForm<UseFormType>({
    defaultValues: {
      search: "",
    },
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { reset } = hookForm;

  function handleToBackPage() {
    reset();
    handleResetData();
    handleRemoveData();
    navigate(HOME_ROUTE);
  }

  const currentPageIsHome =
    pathname === HOME_ROUTE || pathname === HOME_ROUTE + "/";

  return (
    <header
      className={`absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 max-sm:p-2 ${
        currentPageIsHome && "max-md:flex-col max-md:gap-6 max-md:items-start"
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
