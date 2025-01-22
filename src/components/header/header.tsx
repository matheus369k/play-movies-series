import { GrPrevious } from "react-icons/gr";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { PaginationContext } from "@/context/pagination-context";
import { WatchContext } from "@/context/watch-context";
import { HOME_ROUTE } from "@/router/path-routes";
import { FormProvider, useForm } from "react-hook-form";
import { SearchForm } from "./search-form";

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
      className={`absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 max-lg:p-2 ${
        currentPageIsHome && "max-md:flex-col max-md:gap-6 max-md:items-start"
      }`}
    >
      {currentPageIsHome ? (
        <h1 className="text-gray-100 font-bold text-4xl max-lg:text-3xl">
          <span className="text-red-600">Play</span> Filmes e Series
        </h1>
      ) : (
        <button
          data-testid="btn-back"
          onClick={handleToBackPage}
          type="button"
          title="Volta"
        >
          <GrPrevious className="w-11 h-auto max-sm:w-8" />
        </button>
      )}
      <FormProvider {...hookForm}>
        <SearchForm currentPageIsHome={currentPageIsHome} />
      </FormProvider>
    </header>
  );
}
