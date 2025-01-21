import { TMoviesInfoWithPagination } from "@/types";

interface TPageDataContext {
  moviesInfoWithPagination?: TMoviesInfoWithPagination;
  setMoviesInfoWithPagination?: React.Dispatch<
    React.SetStateAction<TMoviesInfoWithPagination>
  >;
}

export function handlePassToNextPage({
  setMoviesInfoWithPagination,
  moviesInfoWithPagination,
}: TPageDataContext) {
  if (setMoviesInfoWithPagination) {
    setMoviesInfoWithPagination({
      ...moviesInfoWithPagination,
      loading: "loading",
      currentPage: (moviesInfoWithPagination?.currentPage || 1) + 1,
    });
  }
}

export function handlePassToEndPage({
  setMoviesInfoWithPagination,
  moviesInfoWithPagination,
}: TPageDataContext) {
  if (setMoviesInfoWithPagination) {
    setMoviesInfoWithPagination({
      ...moviesInfoWithPagination,
      loading: "loading",
      currentPage: moviesInfoWithPagination?.totalPages || 1,
    });
  }
}

export function handlePassToPreviousPage({
  setMoviesInfoWithPagination,
  moviesInfoWithPagination,
}: TPageDataContext) {
  if (setMoviesInfoWithPagination) {
    setMoviesInfoWithPagination({
      ...moviesInfoWithPagination,
      loading: "loading",
      currentPage: (moviesInfoWithPagination?.currentPage || 1) - 1,
    });
  }
}

export function handlePassToStartPage({
  setMoviesInfoWithPagination,
  moviesInfoWithPagination,
}: TPageDataContext) {
  if (setMoviesInfoWithPagination) {
    setMoviesInfoWithPagination({
      ...moviesInfoWithPagination,
      loading: "loading",
      currentPage: 1,
    });
  }
}
