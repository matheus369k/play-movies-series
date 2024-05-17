import { GrCaretNext } from "react-icons/gr";
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import { ButtonSwitchPage } from "../components/button-switch-page";
import { passToEndPage, passToNextPage, passToPreviousPage, passToStartPage } from "../functions/pagination";
import { useContext } from "react";
import { PageDataContext } from "../../../app";

export function Pagination() {
    const { dataMoviesSeries, setDataMoviesSeries } = useContext(PageDataContext);

    return (
        <div className="mx-auto flex items-center gap-3">
            <ButtonSwitchPage
                disabled={(dataMoviesSeries?.currentPage || 1) === 1}
                onClick={() => passToStartPage({setDataMoviesSeries, dataMoviesSeries})}>
                <GrChapterPrevious />
            </ButtonSwitchPage>
            <ButtonSwitchPage
                disabled={(dataMoviesSeries?.currentPage || 1) === 1}
                onClick={() => passToPreviousPage({setDataMoviesSeries, dataMoviesSeries})}>
                <GrCaretPrevious />
            </ButtonSwitchPage>
            <p>
                <span>{dataMoviesSeries?.currentPage || 1} </span>/
                <span> {dataMoviesSeries?.totalPages || 1}</span>
            </p>
            <ButtonSwitchPage
                disabled={dataMoviesSeries?.currentPage === dataMoviesSeries?.totalPages}
                onClick={() => passToNextPage({setDataMoviesSeries, dataMoviesSeries})}>
                <GrCaretNext />
            </ButtonSwitchPage>
            <ButtonSwitchPage
                disabled={dataMoviesSeries?.currentPage === dataMoviesSeries?.totalPages}
                onClick={() => passToEndPage({setDataMoviesSeries, dataMoviesSeries})}>
                <GrChapterNext />
            </ButtonSwitchPage>
        </div>
    )
}