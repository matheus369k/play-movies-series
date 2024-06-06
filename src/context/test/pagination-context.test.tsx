import { PaginationContextProvider } from "../pagination-context";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

const spyState = jest.spyOn(React, "useState");

const setParams = (url: URL, name: string, value: string | number) => {
    url.searchParams.set(name, value.toString());

    window.history.pushState({}, "", url);
}

describe("PaginationContextProvider", () => {
    beforeEach(()=> jest.clearAllMocks());

    it("Initial context state", () => {
        render(<PaginationContextProvider />);

        expect(spyState.mock.results[0].value[0]).toEqual({
            data: undefined,
            title: "all",
            totalPages: 1,
            currentPage: 1,
            loading: "loading"
        });
    })

    it("More page with params", () => {
        const url = new URL(window.location.origin.toString() + "/more");

        setParams(url, "title", "lançamentos");
        setParams(url, "page", 10);
        setParams(url, "type", "movies");
        setParams(url, "year", 2020);

        render(<PaginationContextProvider />);

        expect(spyState.mock.results[0].value[0]).toEqual({
            data: undefined,
            title: "lançamentos",
            currentPage: 10,
            type: "movies",
            year: 2020,
            loading: "loading"
        })
    })

    it("More page with params empty", ()=>{
        const url = new URL(window.location.origin.toString() + "/more");

        setParams(url, "title", "");
        setParams(url, "page", "");
        setParams(url, "type", "");
        setParams(url, "year", "");

        render(<PaginationContextProvider />);

        expect(spyState.mock.results[0].value[0]).toEqual({
            data: undefined,
            title: "Todos",
            currentPage: 1,
            type: "",
            year: 1999,
            loading: "loading"
        })
    })

    it("Search page with params", () => {
        const url = new URL(window.location.origin.toString() + "/search");

        setParams(url, "search", "Transformers");
        setParams(url, "page", 10);

        render(<PaginationContextProvider />);

        expect(spyState.mock.results[0].value[0]).toEqual({
            data: undefined,
            title: "Transformers",
            totalPages: 1,
            currentPage: 10,
            loading: "loading",
        });
    })

    it("Search page with params empty", () => {
        const url = new URL(window.location.origin.toString() + "/search");

        setParams(url, "search", "");
        setParams(url, "page", "");

        render(<PaginationContextProvider />);

        expect(spyState.mock.results[0].value[0]).toEqual({
            data: undefined,
            title: "all",
            totalPages: 1,
            currentPage: 1,
            loading: "loading",
        });
    })
})