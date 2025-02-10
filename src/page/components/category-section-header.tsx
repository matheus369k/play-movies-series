import { resetScroll } from "@/components/functions/reset-scroll";
import { WatchContext } from "@/context/watch-context";
import { useContext } from "react";
import { MORE_ROUTE } from "@/router/path-routes";
import { useNavigate } from "react-router";
import { setParamsAtUrl } from "../functions/add-url-params";
import { SearchContext } from "@/context/search-context";

interface PropsCategorySectionHeader {
  type: string;
  title: string;
  year: number;
}

export function CategorySectionHeader({
  title,
  type,
  year,
}: PropsCategorySectionHeader) {
  const { handleResetData } = useContext(WatchContext);
  const { handleResetContext } = useContext(SearchContext);
  const navigate = useNavigate();

  function handleGetDataOfMovie() {
    handleResetContext();
    handleResetData();

    navigate(MORE_ROUTE);
    
    setParamsAtUrl("title", title || "");
    setParamsAtUrl("type", type || "");
    setParamsAtUrl("year", year || 1999);
    
    resetScroll();
  }

  return (
    <span className="flex justify-between items-center pl-3 border-l-4 border-l-red-600 mb-6 rounded">
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
