import { createContext, useState } from "react";
import { TStateMovieAllInfo, TMovieWatch } from "../types";

export const WatchContext = createContext<TStateMovieAllInfo>({});

export function WatchContextProvider(props: any) {
    const [movieWatch, setMovieWatch] = useState<TMovieWatch>(() => {
        const url = new URL(window.location.toString());

        if (url.searchParams.has("id")) {
            return {
                imdbID: url.searchParams.get("id") || "",
                loading: "loading",
                index: 0,
                data: {}
            };
        }
        return {
            imdbID: "",
            loading: "loading",
            index: 0,
            data: {}
        };
    });

    return (
        <WatchContext.Provider value={{ movieWatch, setMovieWatch }}>
            {props.children}
        </WatchContext.Provider>
    )
}