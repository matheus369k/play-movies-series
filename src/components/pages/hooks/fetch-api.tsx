import axios from "axios";
import React, { useEffect } from "react";
import { TMovieWatch, TMoviesInfoWithPagination } from "../../../types";
import { setParamsAtUrl } from "../functions/add-url-params";

export function FeatchApiPagination(
    state: TMoviesInfoWithPagination | undefined,
    setState: React.Dispatch<React.SetStateAction<TMoviesInfoWithPagination>> | undefined,
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

            setParamsAtUrl("page", state?.currentPage || 1);
        }).catch(() => {
            setState({
                ...state,
                loading: "error"
            })
        });

        if (state?.title === undefined || state?.title === "" || paramsName === undefined) return;

        setParamsAtUrl(paramsName, state.title)
    }, [state?.title, state?.currentPage]);
}

export function FeatchApiOneData(
    state: TMovieWatch | undefined,
    setState: React.Dispatch<React.SetStateAction<TMovieWatch>> | undefined,
    imdbID: string | undefined,
    paramsName?: string
) {
    if (state === undefined || setState === undefined) return;

    const idMovie = imdbID || state.imdbID;

    useEffect(() => {

        const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${idMovie}`;

        axios.get(url).then(resp => {
            if (resp.data.Response === "False") throw new Error("databese not found");

            setState({...state, imdbID: resp.data.imdbID ,data: resp.data, loading: "finnish" })

        }).catch(() => {
            setState({ ...state, loading: "error" })
        });

        if (idMovie === "" || idMovie === undefined || paramsName === undefined) return;

        setParamsAtUrl(paramsName, idMovie);
    }, [idMovie])
}