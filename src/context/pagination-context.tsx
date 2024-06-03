import { createContext, useState } from "react";
import { TMoviesInfoWithPagination, TStateMoviesInfoWithPagination } from "../types";

export const PaginationContext = createContext<TStateMoviesInfoWithPagination>({});

export function PaginationContextProvider(props: any) {
    const [moviesInfoWithPagination, setMoviesInfoWithPagination] = useState<TMoviesInfoWithPagination>(() => {
        const url = new URL(window.location.toString());
        const pathName = window.location.pathname;

        if (pathName === "/search" && url.searchParams.has("search")) {
            return reloadUrlStateWithSearchParams(url)
        };
        if (pathName === "/more") {
            return reloadUrlStateWithMoreParams(url)
        };

        return {
            data: undefined,
            title: "all",
            totalPages: 1,
            currentPage: 1,
            loading: "loading"
        };
    });

    function getUrlParams(url: URL ,nameParams: string) {
        return url.searchParams.get(nameParams);
    }

    function reloadUrlStateWithMoreParams(url: URL): TMoviesInfoWithPagination {
        return {
            data: undefined,
            title: getUrlParams(url, "title")?.replace("+", " ") || "Todos",
            currentPage: parseInt(getUrlParams(url, "page") || "1"),
            type: getUrlParams(url, "type") || "",
            year: parseInt(getUrlParams(url, "year") || "1999"),
            loading: "loading"
        }
    }

    function reloadUrlStateWithSearchParams(url: URL): TMoviesInfoWithPagination {
        return {
            data: undefined,
            title: getUrlParams(url, "search")?.replace("+", " ") || "all",
            totalPages: 1,
            currentPage: parseInt(getUrlParams(url, "page") || "1"),
            loading: "loading",
        };
    }

    return (
        <PaginationContext.Provider value={{ moviesInfoWithPagination, setMoviesInfoWithPagination }}>
            {props.children}
        </PaginationContext.Provider>
    )
}