import axios from "axios";
import React, { useEffect } from "react";
import { TMoviesSeriesInFocus, TStateDataMoviesSeries } from "../../../types";

export function FeatchApiPagination(
    state: TStateDataMoviesSeries | undefined,
    setState: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>> | undefined,
    url: string,
    paramsName?: string
) {
    useEffect(() => {
        axios.get(url).then(resp => {
            if (resp.data.Search === undefined) {
                throw new Error("database not found")
            };
            if (setState === undefined) throw new Error("State not found")
            setState({
                ...state,
                data: resp.data.Search,
                totalPages: Math.round(parseInt(resp.data.totalResults) / 10)
            })
        }).catch(() => {
            window.location.href = "/"
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
){
    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${imdbID}`;
        axios.get(url).then(resp => {
            if (resp.data === undefined) throw new Error("databese not found");
            if (setState === undefined) throw new Error("state not found");
    
            setState({...resp.data, index: state?.index || 0})

        }).catch(() => {
            window.location.href = "/"
        });
    
        if (imdbID === undefined || imdbID === "" || imdbID === null || paramsName === undefined) return;
    
        const newUrl = new URL(window.location.toString());
        newUrl.searchParams.set("id", imdbID || "");
    
        window.history.pushState({}, "", newUrl);
    }, [imdbID])

}