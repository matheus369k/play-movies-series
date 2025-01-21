import { GrCaretNext } from "react-icons/gr";
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import { ButtonSwitchPage } from "./button-switch-page";
import { PaginationContext } from "../../context/pagination-context";
import { useContext } from "react";

export function Pagination() {
  const {
    state,
    handleNextPage,
    handleLastPage,
    handlePrevPage,
    handleStartPage,
  } = useContext(PaginationContext);

  return (
    <div
      data-testid="btn-switch-page"
      className="mx-auto flex items-center gap-3"
    >
      <ButtonSwitchPage
        data-testid="btn-switch-initial-page"
        disabled={(state?.currentPage || 1) === 1}
        onClick={handleStartPage}
      >
        <GrChapterPrevious />
      </ButtonSwitchPage>
      <ButtonSwitchPage
        data-testid="btn-switch-previous-page"
        disabled={(state?.currentPage || 1) === 1}
        onClick={handlePrevPage}
      >
        <GrCaretPrevious />
      </ButtonSwitchPage>
      <p>
        <span>{state?.currentPage || 1} </span>/
        <span> {state?.totalPages || 1}</span>
      </p>
      <ButtonSwitchPage
        data-testid="btn-switch-next-page"
        disabled={state?.currentPage === state?.totalPages}
        onClick={handleNextPage}
      >
        <GrCaretNext />
      </ButtonSwitchPage>
      <ButtonSwitchPage
        data-testid="btn-switch-end-page"
        disabled={state?.currentPage === state?.totalPages}
        onClick={handleLastPage}
      >
        <GrChapterNext />
      </ButtonSwitchPage>
    </div>
  );
}
