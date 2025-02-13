// componentes de display
import { IoSearchOutline } from "react-icons/io5";

// componentes logicos
import { SearchContext } from "@/context/search-context";
import { TopResetScroll } from "@/functions";
import { SEARCH_ROUTE } from "@/router/path-routes";
import { UseFormType } from "./header";

// libs
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router";
import { useContext } from "react";

export function SearchForm({
  currentPageIsHome,
}: {
  currentPageIsHome: boolean;
}) {
  const { handleSubmit, reset, register } = useFormContext<UseFormType>();
  const { handleUpdateSearch } = useContext(SearchContext);
  const navigate = useNavigate();

  // Submit do campo de pesquisa
  function handleSubmitSearchForm({ search }: UseFormType) {
    navigate(SEARCH_ROUTE + `?search=${search}`);
    handleUpdateSearch({ search });
    TopResetScroll();
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSearchForm)}
      autoComplete="off"
      className={`relative text-gray-400 backdrop-blur-sm ${
        currentPageIsHome && "max-md:mx-auto"
      }`}
    >
      <label htmlFor="search">
        <IoSearchOutline className="absolute top-1/2 left-2 -translate-y-1/2 size-8 z-10 max-sm:size-6" />
      </label>
      <input
        {...register("search")}
        className="bg-gray-200/20 text-gray-100 outline-none border border-gray-500 focus:border-gray-100 focus:outline-none placeholder:text-gray-400 w-full p-2 pl-12 rounded-full max-sm:text-sm max-sm:pl-10"
        type="search"
        placeholder="Search..."
      />
    </form>
  );
}
