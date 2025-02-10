import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom"
import { Header } from "./header";
import "@testing-library/jest-dom";
import { TMovieWatch, TMoviesInfoWithPagination } from "../../types";
import { WatchContextProvider } from "../../context/watch-context";
//import { PaginationContextProvider } from "../../context/pagination-context";
import React from "react";

const mockNavigate = jest.fn();

const spyState = jest.spyOn(React, "useState");

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}));

const renderComponentHeader = () => {
    const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
    let movieWatch: TMovieWatch = {
        data: {},
        imdbID: "",
        index: 0,
        loading: "finnish"
    }

    const setMovieWatch = jest.fn();
    const setMoviesInfoWithPagination = jest.fn();

    spyState
        .mockImplementationOnce(() => [movieWatch, setMovieWatch])
        .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

    render(
        <WatchContextProvider>
            <PaginationContextProvider>
                <Header />
            </PaginationContextProvider>
        </WatchContextProvider>
    );

    return {setMovieWatch,  setMoviesInfoWithPagination};
}

describe("Header", () => {
    beforeEach(() => jest.resetAllMocks());

    it("should render at component", () => {
        renderComponentHeader();

        expect(screen.getByText("Filmes e Series")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
    });

    it("when clicking return to home", () => {
        const url = new URL(window.location.toString());
        window.history.pushState({}, "", url + "play-movies-series/more");

        const {setMovieWatch,  setMoviesInfoWithPagination} = renderComponentHeader();

        const buttonBackPage = screen.getByTestId("btn-back");

        fireEvent.click(buttonBackPage);

        expect(mockNavigate.mock.calls[0][0]).toBe("/play-movies-series/");

        expect(setMovieWatch.mock.lastCall[0]).toEqual({
            imdbID: "",
            data: {},
            index: 0,
            loading: "loading"
        });
        expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({
            data: undefined,
            loading: "loading"
        });
    })

    it("when submit search by movies", () => {
        window.scrollTo = jest.fn();

        const {setMoviesInfoWithPagination} = renderComponentHeader();

        const submitSearchForm = screen.getByTestId("search-form");

        fireEvent.submit(submitSearchForm);

        expect(mockNavigate.mock.lastCall[0]).toBe("/play-movies-series/search")

        expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({
            currentPage: 1,
            title: "",
            loading: "loading"
        });
    })
})