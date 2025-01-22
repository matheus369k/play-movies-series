import { resetScroll } from "@/components/functions/reset-scroll";
import { PaginationContext } from "@/context/pagination-context";
import { WatchContext } from "@/context/watch-context";
import { useContext } from "react";
import { ReducerStateType } from "./category-section";
import { MORE_ROUTE } from "@/router/path-routes";
import { useNavigate } from "react-router";
import { setParamsAtUrl } from "../functions/add-url-params";

interface PropsCategorySectionHeader {
  state: ReducerStateType;
  type: string;
  page: number;
  title: string;
  year: number;
}

export function CategorySectionHeader({
  title,
  page,
  type,
  year,
  state,
}: PropsCategorySectionHeader) {
  const { handleGetMovies } = useContext(PaginationContext);
  const { handleResetData } = useContext(WatchContext);
  const navigate = useNavigate();

  function handleGetDataOfMovie() {
    handleResetData();

    if (state.data) {
      handleGetMovies({
        ...state,
        data: state.data,
        title: title,
        type: type,
        year: year,
        currentPage: page,
      });
    }

    resetScroll();
    navigate(MORE_ROUTE);
    
    setParamsAtUrl("title", title || "");
    setParamsAtUrl("type", type || "");
    setParamsAtUrl("year", year || 1999);
    setParamsAtUrl("page", page || 1);
    
  }

  return (
    <span className="flex justify-between items-center pl-3 border-l-8 border-l-red-600 mb-6 rounded-l">
      <h2 className="font-bold capitalize text-4xl max-lg:text-2xl">{title}</h2>
      <span
        data-testid="category-section-more-movies"
        onClick={handleGetDataOfMovie}
        className="text-gray-500 hover:text-gray-100 cursor-pointer"
      >
        More
      </span>
    </span>
  );
}
