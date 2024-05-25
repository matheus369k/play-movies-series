import React from "react";
import { NavigateFunction } from "react-router";
import { resetScroll } from "../../functions/reset-scroll";
import { TResponse, TStateDataMoviesSeries } from "../../../types";

export function handleGetIdMovie(
    id: string | undefined, 
    setImdbID: React.Dispatch<React.SetStateAction<string | null>> | undefined, 
    navigate:  NavigateFunction,
    setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>> | undefined,
    response?: TResponse
) {
    event?.stopImmediatePropagation();

    (document.querySelector("[name='search']") as HTMLFormElement).value = "";

    if (setImdbID && id) setImdbID(id);

    if (setDataMoviesSeries && response) {
        setDataMoviesSeries({
            ...response,
            loading: "loading"
        });
    }

    resetScroll();

    navigate("/watch");
}