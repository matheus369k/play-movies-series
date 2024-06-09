import React from "react";
import { NavigateFunction } from "react-router";
import { resetScroll } from "../../functions/reset-scroll";
import { TMovieWatch, TResponse, TMoviesInfoWithPagination } from "../../../types";

export function handleGetIdMovie(
    id: string | undefined,
    setMovieWatch: React.Dispatch<React.SetStateAction<TMovieWatch>> | undefined,
    navigate: NavigateFunction,
    setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TMoviesInfoWithPagination>> | undefined,
    response?: TResponse
) {
    event?.stopImmediatePropagation();

    const input = (document.querySelector("[name='search']") as HTMLFormElement);

    if (input) input.value = "";

    if (setMovieWatch && id) {
        setMovieWatch({
            data: {},
            index: 0,
            loading: "loading",
            imdbID: id
        });
    }

    if (setDataMoviesSeries && response) {
        setDataMoviesSeries({
            ...response,
            loading: "loading"
        });
    }

    resetScroll();

    navigate("/play-movies-series/watch");
}