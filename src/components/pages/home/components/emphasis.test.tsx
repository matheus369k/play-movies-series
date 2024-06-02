import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom"
import { Emphasis } from "./emphasis";
import React from "react";
import "@testing-library/jest-dom";
import { TMovieWatch } from "../../../../types";
import { WatchContextProvider } from "../../../../context/watch-context";

const mockNavigate = jest.fn();
const mockFeatchApiOneData = jest.fn();
const mockHandleGetIdMovie = jest.fn();

const spyState = jest.spyOn(React, "useState");

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}));

jest.mock("../../hooks/fetch-api", () => ({
    ...jest.requireActual("../../hooks/fetch-api"),
    FeatchApiOneData: () => mockFeatchApiOneData.mockReturnValue(true)
}))

jest.mock("../../functions/get-id-movies", () => ({
    handleGetIdMovie: () => mockHandleGetIdMovie.mockReturnValue(true)
}))

describe("Emphasis", () => {
    it("should render loading display", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "loading"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        expect(screen.getByText("Carregando")).toBeInTheDocument();
    })

    it("should render error display", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "error"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        expect(screen.getByText("Erro ao tentar carregar")).toBeInTheDocument();
    })

    it("should render main display", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        expect(screen.getByTestId("movie-emphasis")).toBeInTheDocument();
    })

    it("clicking to pass next movie", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 1,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        const btnNextMovie = screen.getByTestId("btn-next");

        fireEvent.click(btnNextMovie);

        expect(setMovieWatch).toHaveBeenCalled();
        expect(setMovieWatch.mock.lastCall[0]).toHaveProperty("index", 2);
    })

    it("clicking to pass previous movie", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 1,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        const btnPreviousMovie = screen.getByTestId("btn-previous");

        fireEvent.click(btnPreviousMovie);

        expect(setMovieWatch).toHaveBeenCalled();
        expect(setMovieWatch.mock.lastCall[0]).toHaveProperty("index", 0);
    })

    it("clicking to play movie", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        const moviePlay = screen.getByTestId("emphasis-play-movie");

        fireEvent.click(moviePlay)

        expect(mockHandleGetIdMovie()).toBeTruthy();
    })

    it("Call hook function FeatchApiPagination", () => {
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 1,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();

        spyState.mockImplementationOnce(() => [movieWatch, setMovieWatch])

        render(
            <WatchContextProvider>
                <Emphasis />
            </WatchContextProvider>
        );

        expect(mockFeatchApiOneData()).toBeTruthy();
    })
})