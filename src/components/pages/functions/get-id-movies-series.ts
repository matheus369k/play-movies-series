import React from "react";
import { NavigateFunction } from "react-router";

export function getIdMoviesOrSeries(
    id: string | undefined, 
    setImdbID: React.Dispatch<React.SetStateAction<string | null>> | undefined, 
    navigate:  NavigateFunction
) {
    event?.stopImmediatePropagation();

    (document.querySelector("[name='search']") as HTMLFormElement).value = "";

    if (setImdbID && id) setImdbID(id);

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });

    navigate("/watch");
}