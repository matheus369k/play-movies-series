import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom"
import { Header } from "./header";
import { IdContext, PageDataContext } from "../../app";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}));

describe("Header", () => {
    it("should render at component", () => {
        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Header />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        expect(screen.getByText("Filmes e Series")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Pesquisar...")).toBeInTheDocument();
    });

    it("when clicking return to home", () => {
        const url = new URL(window.location.toString());
        window.history.pushState({}, "", url + "more");

        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Header />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const buttonBackPage = screen.getByTestId("btn-back");

        fireEvent.click(buttonBackPage);

        expect(mockNavigate.mock.calls[0][0]).toBe("/");

        expect(setImdbID).toHaveBeenCalledWith("");
        expect(setDataMoviesSeries).toHaveBeenCalledWith({loading: "loading"});
    })

    it("when submit search by movies", ()=> {
        window.scrollTo = jest.fn();

        let imdbID, dataMoviesSeries;

        const setImdbID = jest.fn();
        const setDataMoviesSeries = jest.fn();

        render(
            <IdContext.Provider value={{ imdbID, setImdbID }}>
                <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
                    <Header />
                </PageDataContext.Provider>
            </IdContext.Provider>
        );

        const submitSearchForm = screen.getByTestId("search-form");

        fireEvent.submit(submitSearchForm);

        expect(mockNavigate.mock.lastCall[0]).toBe("/search")

        expect(setDataMoviesSeries.mock.lastCall[0]).toEqual({
            "currentPage": 1 ,
            "title": "", 
            "loading": "loading"
        });
    })
})