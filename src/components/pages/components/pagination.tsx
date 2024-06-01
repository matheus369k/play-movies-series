import { GrCaretNext } from "react-icons/gr";
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import { ButtonSwitchPage } from "../components/button-switch-page";
import { handlePassToEndPage, handlePassToNextPage, handlePassToPreviousPage, handlePassToStartPage } from "../functions/pagination";
import { PaginationContext } from "../../../context/pagination-context";
import { useContext } from "react";

export function Pagination() {
    const { moviesInfoWithPagination, setMoviesInfoWithPagination } = useContext(PaginationContext);

    return (
        <div
            data-testid="btn-switch-page"
            className="mx-auto flex items-center gap-3"
        >
            <ButtonSwitchPage
                data-testid="btn-switch-initial-page"
                disabled={(moviesInfoWithPagination?.currentPage || 1) === 1}
                onClick={() => handlePassToStartPage({ setMoviesInfoWithPagination, moviesInfoWithPagination })}>
                <GrChapterPrevious />
            </ButtonSwitchPage>
            <ButtonSwitchPage
                data-testid="btn-switch-previous-page"
                disabled={(moviesInfoWithPagination?.currentPage || 1) === 1}
                onClick={() => handlePassToPreviousPage({ setMoviesInfoWithPagination, moviesInfoWithPagination })}>
                <GrCaretPrevious />
            </ButtonSwitchPage>
            <p>
                <span>{moviesInfoWithPagination?.currentPage || 1} </span>/
                <span> {moviesInfoWithPagination?.totalPages || 1}</span>
            </p>
            <ButtonSwitchPage
                data-testid="btn-switch-next-page"
                disabled={moviesInfoWithPagination?.currentPage === moviesInfoWithPagination?.totalPages}
                onClick={() => handlePassToNextPage({ setMoviesInfoWithPagination, moviesInfoWithPagination })}>
                <GrCaretNext />
            </ButtonSwitchPage>
            <ButtonSwitchPage 
                data-testid="btn-switch-end-page"
                disabled={moviesInfoWithPagination?.currentPage === moviesInfoWithPagination?.totalPages}
                onClick={() => handlePassToEndPage({ setMoviesInfoWithPagination, moviesInfoWithPagination })}>
                <GrChapterNext />
            </ButtonSwitchPage>
        </div>
    )
}