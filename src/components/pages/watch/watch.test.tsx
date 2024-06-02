import { WatchContextProvider } from "../../../context/watch-context";
import { PaginationContextProvider } from "../../../context/pagination-context";
import { TMovieWatch, TMoviesInfoWithPagination } from "../../../types";
import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { WatchMovieSeries } from "./watch";
import "@testing-library/jest-dom";
import React from "react";

const spyState = jest.spyOn(React, "useState");

const mockNavigate = jest.fn();
const mockFeatchApiOneData = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}))

jest.mock("../hooks/fetch-api", () => ({
    ...jest.requireActual("../hooks/fetch-api"),
    FeatchApiOneData: () => mockFeatchApiOneData.mockReturnValue(true)
}))

describe("WatchMovieSeries", () => {
    it("should render loading display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
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
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(screen.getByText("Carregando")).toBeInTheDocument();
    })

    it("should render error display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "error"
        }

        const setMovieWatch = jest.fn();
        const setMoviesInfoWithPagination = jest.fn();

        spyState
            .mockImplementationOnce(() => [movieWatch, setMovieWatch])
            .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <WatchContextProvider>
                <PaginationContextProvider>
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(screen.getByText("Erro ao tentar carregar")).toBeInTheDocument();
    })

    it("should render main display", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
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
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(screen.getByTestId("watch-screen-movie")).toBeInTheDocument();
        expect(screen.getByTestId("watch-post-infor-movie")).toBeInTheDocument();
        expect(screen.getByText("Veja também")).toBeInTheDocument();
    })

    it("call to hook function FeatchApiOneData", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
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
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        expect(mockFeatchApiOneData()).toBeTruthy();
    })

    it("clicking button to enter on the fullScreen", () => {
        const watchAction = { isLoading: false, isFullScreen: false };
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();
        const setWatchAction = jest.fn();
        const setMoviesInfoWithPagination = jest.fn();

        const mockRequestFullscreen = window.HTMLBodyElement.prototype.requestFullscreen = jest.fn();
        mockRequestFullscreen.mockImplementation(() => {
            return {
                catch: jest.fn()
            }
        });

        spyState
            .mockImplementationOnce(() => [movieWatch, setMovieWatch])
            .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])
            .mockImplementationOnce(() => [watchAction, setWatchAction])

        render(
            <WatchContextProvider>
                <PaginationContextProvider>
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        const btnFullScreen = screen.getByTestId("watch-btn-fullScreen");

        fireEvent.click(btnFullScreen);

        expect(mockRequestFullscreen).toHaveBeenCalledTimes(1);
        expect(setWatchAction.mock.lastCall[0]).toEqual({ isLoading: false, isFullScreen: true })
    })

    it("clicking button to exit on the fullScreen", () => {
        const watchAction = { isLoading: false, isFullScreen: true };
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();
        const setWatchAction = jest.fn();
        const setMoviesInfoWithPagination = jest.fn();

        const mockExitFullscreen = window.document.exitFullscreen = jest.fn();
        mockExitFullscreen.mockImplementation(() => {
            return {
                catch: jest.fn()
            }
        });

        spyState
            .mockImplementationOnce(() => [movieWatch, setMovieWatch])
            .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])
            .mockImplementationOnce(() => [watchAction, setWatchAction])

        render(
            <WatchContextProvider>
                <PaginationContextProvider>
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        const btnFullScreen = screen.getByTestId("watch-btn-fullScreen");

        fireEvent.click(btnFullScreen);

        expect(mockExitFullscreen).toHaveBeenCalledTimes(1);
        expect(setWatchAction.mock.lastCall[0]).toEqual({ isLoading: false, isFullScreen: false });
    })

    it("clicking to play movie", () => {
        const watchAction = { isLoading: false, isFullScreen: false };
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();
        const setWatchAction = jest.fn();
        const setMoviesInfoWithPagination = jest.fn();

        spyState
            .mockImplementationOnce(() => [movieWatch, setMovieWatch])
            .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])
            .mockImplementationOnce(() => [watchAction, setWatchAction])

        render(
            <WatchContextProvider>
                <PaginationContextProvider>
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        const buttonPlayPauseMovie = screen.getByTestId("watch-play-pause-movie");
        const btnPlayMovie = screen.getByTestId("watch-play-movie");

        fireEvent.click(buttonPlayPauseMovie);
        fireEvent.click(btnPlayMovie);

        expect(setWatchAction).toHaveBeenCalledTimes(2);
        expect(setWatchAction.mock.lastCall[0]).toEqual({ isLoading: true, isFullScreen: false })
    })

    it("clicking to pause movie", () => {
        const watchAction = { isLoading: true, isFullScreen: false };
        const moviesInfoWithPagination: TMoviesInfoWithPagination = { loading: "finnish" };
        const movieWatch: TMovieWatch = {
            data: {},
            imdbID: "",
            index: 0,
            loading: "finnish"
        }

        const setMovieWatch = jest.fn();
        const setWatchAction = jest.fn();
        const setMoviesInfoWithPagination = jest.fn();

        spyState
            .mockImplementationOnce(() => [movieWatch, setMovieWatch])
            .mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])
            .mockImplementationOnce(() => [watchAction, setWatchAction])

        render(
            <WatchContextProvider>
                <PaginationContextProvider>
                    <WatchMovieSeries />
                </PaginationContextProvider>
            </WatchContextProvider>
        );

        const buttonPlayPauseMovie = screen.getByTestId("watch-play-pause-movie");

        fireEvent.click(buttonPlayPauseMovie);

        expect(setWatchAction).toHaveBeenCalledTimes(1);
        expect(setWatchAction.mock.lastCall[0]).toEqual({ isLoading: false, isFullScreen: false })
    })
})