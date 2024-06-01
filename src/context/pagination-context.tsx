import { createContext, useState } from "react";
import { TMoviesInfoWithPagination, TStateMoviesInfoWithPagination } from "../types";

export const PaginationContext = createContext<TStateMoviesInfoWithPagination>({});

export function PaginationContextPorvider(props: any) {
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

    function reloadUrlStateWithMoreParams(url: URL): TMoviesInfoWithPagination {
        return {
            data: undefined,
            title: url.searchParams.get("title")?.replace("+", " ") || "Todos",
            currentPage: parseInt(url.searchParams.get("page") || "1"),
            type: url.searchParams.get("type") || "",
            year: parseInt(url.searchParams.get("year") || "1999"),
            loading: "loading"
        }
    }

    function reloadUrlStateWithSearchParams(url: URL): TMoviesInfoWithPagination {
        return {
            data: undefined,
            title: url.searchParams.get("search")?.replace("+", " ") || "all",
            totalPages: 1,
            currentPage: parseInt(url.searchParams.get("page") || "1"),
            loading: "loading",
        };
    }

    return (
        <PaginationContext.Provider value={{ moviesInfoWithPagination, setMoviesInfoWithPagination }}>
            {props.children}
        </PaginationContext.Provider>
    )
}