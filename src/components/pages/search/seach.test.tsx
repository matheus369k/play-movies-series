import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { TMovieWatch, TMoviesInfoWithPagination } from "../../../types";
import { Search } from "./search";
import "@testing-library/jest-dom";
import { WatchContextProvider } from "../../../context/watch-context";
import { PaginationContextProvider } from "../../../context/pagination-context";
import React from "react";

const mockNavigate = jest.fn();
const mockHandleGetIdMovie = jest.fn();
const mockFeatchApiPagination = jest.fn();

const spyState = jest.spyOn(React, "useState")

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}))

jest.mock("../functions/get-id-movies", () => ({
    handleGetIdMovie: () => mockHandleGetIdMovie.mockReturnValue(true)
}))

jest.mock("../hooks/fetch-api", () => ({
    ...jest.requireActual("../hooks/fetch-api"),
    FeatchApiPagination: () => mockFeatchApiPagination.mockReturnValue(true)
}))

const renderComponentSearch = (moviesInfoWithPagination: TMoviesInfoWithPagination) => {
    const movieWatch: TMovieWatch = {
        data: {},
        imdbID: "",
        index: 0,
        loading: "loading"
    }

    const setMovieWatch = jest.fn();
    const setMoviesInfoWithPagination = jest.fn();

    spyState
        .mockImplementationOnce(() => [movieWatch, setMovieWatch])
        .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

    render(
        <WatchContextProvider>
            <PaginationContextProvider>
                <Search />
            </PaginationContextProvider>
        </WatchContextProvider>
    );

    return {setMovieWatch, setMoviesInfoWithPagination};
}

describe("Search", () => {
    beforeEach(() => jest.resetAllMocks());

    it("should render loading display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "loading" };

        renderComponentSearch(moviesInfoWithPagination);

        expect(screen.getByText("Procurando...")).toBeInTheDocument();
    })

    it("should render error display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "error" };

        renderComponentSearch(moviesInfoWithPagination);

        expect(screen.getByText("Nada foi Encontrado")).toBeInTheDocument();
    })

    it("should render main display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };

        renderComponentSearch(moviesInfoWithPagination);

        expect(screen.getByTestId("search-movies")).toBeInTheDocument();
        expect(screen.getByTestId("btn-switch-page")).toBeInTheDocument();
    })

    it("clicking to play movie", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            data: [{
                Poster: "https://",
                Title: "Transformers",
                imdbID: "h785k673j464",
                Type: "movie",
                Year: "2008"
            }],
            loading: "finnish",
        };

        renderComponentSearch(moviesInfoWithPagination);

        const moviePlay = screen.getByTestId("search-play-movie");

        fireEvent.click(moviePlay);

        expect(mockHandleGetIdMovie()).toBeTruthy();
    })

    it("call to hook function mockFeatchApiPagination", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };

        renderComponentSearch(moviesInfoWithPagination);

        expect(mockFeatchApiPagination()).toBeTruthy();
    });
})