import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { IdContext, PageDataContext } from "../../../app";
import { TStateDataMoviesSeries } from "../../../types";
import { Search } from "./search";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
const mockHandleGetIdMovie = jest.fn();
const mockFeatchApiPagination = jest.fn();

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

describe("Search", () => {
    it("should render loading display", () => {
        const dataMoviesSeries: TStateDataMoviesSeries = { loading: "loading" };
        let imdbID;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Search />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Procurando...")).toBeInTheDocument();
    })

    it("should render error display", () => {
        const dataMoviesSeries: TStateDataMoviesSeries = { loading: "error" };
        let imdbID;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Search />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Nada foi Encontrado")).toBeInTheDocument();
    })

    it("should render main display", () => {
        const dataMoviesSeries: TStateDataMoviesSeries = { loading: "finnish" };
        let imdbID;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Search />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByTestId("search-movies")).toBeInTheDocument();
        expect(screen.getByTestId("btn-switch-page")).toBeInTheDocument();
    })

    it("clicking to play movie", () => {
        const dataMoviesSeries: TStateDataMoviesSeries = {
            data: [{
                Poster: "https://",
                Title: "Transformers",
                imdbID: "h785k673j464",
                Type: "movie",
                Year: "2008"
            }],
            loading: "finnish"
        };
        let imdbID;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Search />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const moviePlay = screen.getByTestId("search-play-movie");

        fireEvent.click(moviePlay);

        expect(mockHandleGetIdMovie()).toBeTruthy();
    })

    it("call to hook function mockFeatchApiPagination", () => {
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Search />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(mockFeatchApiPagination()).toBeTruthy();
    });
})