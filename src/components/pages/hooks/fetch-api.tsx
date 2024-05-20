import axios from "axios";
import React, { useEffect } from "react";
import { TMoviesSeriesInFocus, TResponse, TStateDataMoviesSeries } from "../../../types";

export function FeatchApiPagination(
    state: TStateDataMoviesSeries & TResponse | undefined,
    setState: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries & TResponse>> | undefined,
    url: string,
    paramsName?: string
) {
    useEffect(() => {
        if (setState === undefined) throw new Error("State not found")

        axios.get(url).then(resp => {
            if (resp.data.Search === undefined) {
                throw new Error("database not found")
            };

            setState({
                ...state,
                data: resp.data.Search,
                totalPages: Math.round(parseInt(resp.data.totalResults) / 10),
                loading: "finnish"
            })
        }).catch(() => {
            setState({
                ...state,
                loading: "error"
            })
        });

        if (state?.title === undefined || state?.title === "" || paramsName === undefined) return;

        const newUrl = new URL(window.location.toString());
        const searchConversionURLType = new URLSearchParams(state?.title).toString();

        newUrl.searchParams.set(paramsName, searchConversionURLType);
        window.history.pushState({}, "", newUrl);
    }, [state?.title, state?.currentPage]);
}

export function FeatchApiOneData(
    state: TMoviesSeriesInFocus | undefined,
    setState: React.Dispatch<React.SetStateAction<TMoviesSeriesInFocus>>,
    imdbID: string | null | undefined,
    paramsName?: string
) {
    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${imdbID}`;

        if (setState === undefined) throw new Error("state not found");

        axios.get(url).then(resp => {
            if (resp.data.Response === "False") throw new Error("databese not found");


            setState({ ...resp.data, loading: "finnish", index: state?.index || 0 })

        }).catch(() => {
            setState({ ...state, loading: "error" })
        });

        if (imdbID === undefined || imdbID === "" || imdbID === null || paramsName === undefined) return;

        const newUrl = new URL(window.location.toString());
        newUrl.searchParams.set("id", imdbID || "");

        window.history.pushState({}, "", newUrl);
    }, [imdbID])

}