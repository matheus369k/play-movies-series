import { TopResetScroll } from "@/functions";
import { SearchContext } from "@/context/search-context";
import { WatchContext } from "@/context/watch-context";
import { MORE_ROUTE } from "@/router/path-routes";
import { useNavigate } from "react-router";
import { useContext } from "react";

interface CategorySectionHeaderProps {
  type: string;
  title: string;
  year: number;
}

export function CategorySectionHeader({
  title,
  type,
  year,
}: CategorySectionHeaderProps) {
  const { handleResetData } = useContext(WatchContext);
  const { handleResetContext } = useContext(SearchContext);
  const navigate = useNavigate();

  function handleGetDataOfMovie() {
    TopResetScroll();

    // Resetar contextos
    handleResetContext();
    handleResetData();
    
    navigate(
      MORE_ROUTE + "?title=" + title + "&type=" + type + "&year=" + year
    );
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
