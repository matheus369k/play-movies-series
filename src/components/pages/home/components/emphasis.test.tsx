import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom"
import { IdContext, PageDataContext } from "../../../../app";
import { Emphasis } from "./emphasis";
import React from "react";
import "@testing-library/jest-dom";

const mockState = jest.spyOn(React, "useState");
const mockNavigate = jest.fn();
const mockFeatchApiOneData = jest.fn();
const mockHandleGetIdMovie = jest.fn();

jest.mock("react-router", ()=> ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}));

jest.mock("../../hooks/fetch-api", ()=> ({
    ...jest.requireActual("../../hooks/fetch-api"),
    FeatchApiOneData: () =>  mockFeatchApiOneData.mockReturnValue(true)
}))

jest.mock("../../functions/get-id-movies", ()=>({
    handleGetIdMovie: () => mockHandleGetIdMovie.mockReturnValue(true)
}))

describe("Emphasis", () => {
    it("should render loading display", () => {
        const moviesSeries = { index: 0, Response: "False", loading: "loading" };

        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();
        const setState = jest.fn();

        mockState.mockImplementationOnce(() => [moviesSeries, setState]);

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Carregando")).toBeInTheDocument();
    })

    it("should render error display", ()=> {
        const moviesSeries = { index: 0, Response: "False", loading: "error" };

        let imdbID,dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();
        const setState = jest.fn();

        mockState.mockImplementationOnce(() => [moviesSeries, setState]);

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Erro ao tentar carregar")).toBeInTheDocument();
    })

    it("should render main display", ()=>{
        const moviesSeries = { index: 0, Response: "False", loading: "finnish" };

        let imdbID,dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();
        const setState = jest.fn();

        mockState.mockImplementationOnce(() => [moviesSeries, setState]);

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByTestId("movie-emphasis")).toBeInTheDocument();

    })

    it("clicking to pass next movie", ()=>{
        const moviesSeries = { index: 1, Response: "False", loading: "finnish" };

        let imdbID,dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();
        const setState = jest.fn();

        mockState.mockImplementation(() => [moviesSeries, setState]);

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const btnNextMovie = screen.getByTestId("btn-next");

        fireEvent.click(btnNextMovie);

        expect(setState).toHaveBeenCalled();
        expect(setState.mock.lastCall[0]).toHaveProperty("index", 2);
    })

    it("clicking to pass previous movie", () => {
        const moviesSeries = { index: 1, Response: "False", loading: "finnish" };

        let imdbID,dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();
        const setState = jest.fn();

        mockState.mockImplementation(() => [moviesSeries, setState]);

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );
        
        const btnPreviousMovie = screen.getByTestId("btn-previous");
        
        fireEvent.click(btnPreviousMovie);

        expect(setState).toHaveBeenCalled(); 
        expect(setState.mock.lastCall[0]).toHaveProperty("index", 0);
    })

    it("clicking to play movie", () =>{
        const moviesSeries = {index: 0, Response: "False", loading: "finnish"};
        let imdbID, dataMoviesSeries;

        const setState = jest.fn();
        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        mockState.mockImplementation(()=> [moviesSeries, setState])

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const moviePlay = screen.getByTestId("emphasis-play-movie");

        fireEvent.click(moviePlay)

        expect(mockHandleGetIdMovie()).toBeTruthy();
    })

    it("Call hook function FeatchApiPagination", () => {
        let dataMoviesSeries, imdbID;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Emphasis />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(mockFeatchApiOneData()).toBeTruthy();
    })
})