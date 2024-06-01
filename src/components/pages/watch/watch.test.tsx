import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { WatchMovieSeries } from "./watch";
import "@testing-library/jest-dom";
import { IdContext, PageDataContext } from "../../../app";
import React from "react";

const spyState = jest.spyOn(React, "useState");

const mockNavigate = jest.fn();
const mockFeatchApiOneData = jest.fn();

jest.mock("react-router", ()=>({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}))

jest.mock("../hooks/fetch-api", ()=>({
    ...jest.requireActual("../hooks/fetch-api"),
    FeatchApiOneData: () => mockFeatchApiOneData.mockReturnValue(true)
}))

describe("WatchMovieSeries", ()=>{
    it("should render loading display", () => {
        const movieSeriesData = { index: 0, Response: "False", loading: "loading" };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementation(()=>[movieSeriesData ,setMovieSeriesData])

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Carregando")).toBeInTheDocument();
    })

    it("should render error display", () => {
        const movieSeriesData = { index: 0, Response: "False", loading: "error" };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementation(()=>[movieSeriesData ,setMovieSeriesData])

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Erro ao tentar carregar")).toBeInTheDocument();
    })

    it("should render main display", () => {
        const movieSeriesData = { index: 0, Response: "False", loading: "finnish" };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementation(()=>[movieSeriesData ,setMovieSeriesData])

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );


        expect(screen.getByTestId("watch-screen-movie")).toBeInTheDocument();
        expect(screen.getByTestId("watch-post-infor-movie")).toBeInTheDocument();
        expect(screen.getByText("Veja também")).toBeInTheDocument();
    })

    it("call to hook function FeatchApiOneData", ()=>{
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(mockFeatchApiOneData()).toBeTruthy();
    })

    it("clicking button to enter on the fullScreen", () =>{
        const movieSeriesData = { index: 0, Response: "False", loading: "finnish" };
        const watchAction = { isLoading: false, isFullScreen: false };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setwatchAction = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementationOnce(()=>[movieSeriesData ,setMovieSeriesData])
        spyState.mockImplementationOnce(()=>[watchAction, setwatchAction])

        const mockRequestFullscreen = window.HTMLBodyElement.prototype.requestFullscreen = jest.fn();
        mockRequestFullscreen.mockImplementation(() => {
            return {
                catch: jest.fn()
            }
        });

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const btnFullScreen = screen.getByTestId("watch-btn-fullScreen");

        fireEvent.click(btnFullScreen);

        expect(mockRequestFullscreen).toHaveBeenCalledTimes(1);
        expect(setwatchAction.mock.lastCall[0]).toEqual({ isLoading: false, isFullScreen: true })
    })

    it("clicking button to exit on the fullScreen", () => {
        const movieSeriesData = { index: 0, Response: "False", loading: "finnish" };
        const watchAction = { isLoading: false, isFullScreen: true };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setwatchAction = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementationOnce(()=>[movieSeriesData ,setMovieSeriesData])
        spyState.mockImplementationOnce(()=>[watchAction, setwatchAction])

        const mockExitFullscreen = window.document.exitFullscreen = jest.fn();
        mockExitFullscreen.mockImplementation(() => {
            return {
                catch: jest.fn()
            }
        });

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const btnFullScreen = screen.getByTestId("watch-btn-fullScreen");
        
        fireEvent.click(btnFullScreen);
        
        expect(mockExitFullscreen).toHaveBeenCalledTimes(1);
        expect(setwatchAction.mock.lastCall[0]).toEqual({ isLoading: false, isFullScreen: false });
    })

    it("clicking to play movie", () => {
        const movieSeriesData = { index: 0, Response: "False", loading: "finnish" };
        const watchAction = { isLoading: false, isFullScreen: false };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setwatchAction = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementationOnce(()=>[movieSeriesData ,setMovieSeriesData])
        spyState.mockImplementationOnce(()=>[watchAction, setwatchAction])

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const buttonPlayPauseMovie = screen.getByTestId("watch-play-pause-movie");
        const btnPlayMovie = screen.getByTestId("watch-play-movie");
        
        fireEvent.click(buttonPlayPauseMovie);
        fireEvent.click(btnPlayMovie);

        expect(setwatchAction).toHaveBeenCalledTimes(2);
        expect(setwatchAction.mock.lastCall[0]).toEqual({ isLoading: true, isFullScreen: false })
    })

    it("clicking to pause movie", ()=>{
        const movieSeriesData = { index: 0, Response: "False", loading: "finnish" };
        const watchAction = { isLoading: true, isFullScreen: false };
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setwatchAction = jest.fn();
        const setMovieSeriesData = jest.fn();
        const setDataMoviesSeries = jest.fn();

        spyState.mockImplementationOnce(()=>[movieSeriesData ,setMovieSeriesData])
        spyState.mockImplementationOnce(()=>[watchAction, setwatchAction])

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <WatchMovieSeries />
                </PageDataContext.Provider>;
            </IdContext.Provider>
        );

        const buttonPlayPauseMovie = screen.getByTestId("watch-play-pause-movie");

        fireEvent.click(buttonPlayPauseMovie);

        expect(setwatchAction).toHaveBeenCalledTimes(1);
        expect(setwatchAction.mock.lastCall[0]).toEqual({ isLoading: false, isFullScreen: false })
    })
})