import { MoreMoviesSeries } from "./more";
import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom"
import { TMovieWatch, TMoviesInfoWithPagination } from "../../../types";
import "@testing-library/jest-dom";
import { WatchContextProvider } from "../../../context/watch-context";
import { PaginationContextProvider } from "../../../context/pagination-context";
import React from "react";

const mockNavigate = jest.fn();
const mockHandleGetIdMovie = jest.fn();
const mockFeatchApiPagination = jest.fn();

const spyState = jest.spyOn(React, "useState");

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}));

jest.mock("../hooks/fetch-api", () => ({
    ...jest.requireActual("../hooks/fetch-api"),
    FeatchApiPagination: () => mockFeatchApiPagination.mockReturnValue(true)
}));

jest.mock("../functions/get-id-movies", () => ({
    ...jest.requireActual("../functions/get-id-movies"),
    handleGetIdMovie: () => mockHandleGetIdMovie.mockReturnValue(() => true)
}))

describe("MoreMoviesSeries", () => {
    it("should render loading display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "loading" };
        const movieWatch: TMovieWatch = {
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
                    <MoreMoviesSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(screen.getByText("Carregando")).toBeInTheDocument();
    })

    it("should render error display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "error" };
        const movieWatch: TMovieWatch = {
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
                    <MoreMoviesSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(screen.getByText("Erro ao tentar carregar")).toBeInTheDocument();
    })

    it("should render main display", () => {
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
                    <MoreMoviesSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(screen.getByTestId("more-movies")).toBeInTheDocument();
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
            loading: "finnish"
        };
        const movieWatch: TMovieWatch = {
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
                    <MoreMoviesSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        const moviePlay = screen.getByTestId("more-movie-play");

        fireEvent.click(moviePlay);

        expect(mockHandleGetIdMovie()).toBeTruthy();
    })

    it("Call to hook function FeatchApiPagination", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "loading" };
        const movieWatch: TMovieWatch = {
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
                    <MoreMoviesSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(mockFeatchApiPagination()).toBeTruthy();
    })
})
