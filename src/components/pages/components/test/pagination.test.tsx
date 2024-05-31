import { screen } from "@testing-library/dom";
import { render, fireEvent } from "@testing-library/react";
import { PageDataContext } from "../../../../app";
import { Pagination } from "../pagination";
import "@testing-library/dom";
import { TStateDataMoviesSeries } from "../../../../types";
import React from "react";

interface PropsMock {
    dataMoviesSeries?: TStateDataMoviesSeries
    setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
}

const mockHandlePassToEndPage = jest.fn();
const mockHandlePassToStartPage = jest.fn();
const mockHandlePassToNextPage = jest.fn();
const mockHandlePassToPreviousPage = jest.fn();


jest.mock("../../functions/pagination", () => ({
    handlePassToNextPage: ({ 
        dataMoviesSeries, 
        setDataMoviesSeries 
    }: PropsMock) => mockHandlePassToNextPage({dataMoviesSeries, setDataMoviesSeries}),
    handlePassToStartPage: ({
        dataMoviesSeries, 
        setDataMoviesSeries
    }: PropsMock) => mockHandlePassToStartPage({dataMoviesSeries, setDataMoviesSeries}),
    handlePassToPreviousPage: ({
        dataMoviesSeries, 
        setDataMoviesSeries
    }: PropsMock) => mockHandlePassToPreviousPage({dataMoviesSeries, setDataMoviesSeries}),
    handlePassToEndPage: ({ 
        dataMoviesSeries, 
        setDataMoviesSeries 
    }: PropsMock) => mockHandlePassToEndPage({dataMoviesSeries, setDataMoviesSeries})
}))

describe("Pagination Component", () => {
    beforeEach(()=> jest.clearAllMocks())

    it("clicking to next 1 page", () => {
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = {
            loading: "finnish",
            currentPage: 1,
            totalPages: 12,
        };

        const setDataMoviesSeries = jest.fn()

        render(
            <PageDataContext.Provider value={{ setDataMoviesSeries, dataMoviesSeries }}>
                <Pagination />
            </PageDataContext.Provider>
        )

        const nextPage = screen.getByTestId("btn-switch-next-page");

        fireEvent.click(nextPage);

        expect(mockHandlePassToNextPage.mock.lastCall[0]).toEqual({ setDataMoviesSeries, dataMoviesSeries });
    })

    it("clicking to previous 1 page", ()=> {
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = {
            loading: "finnish",
            currentPage: 2,
            totalPages: 12,
        };

        const setDataMoviesSeries = jest.fn()

        render(
            <PageDataContext.Provider value={{ setDataMoviesSeries, dataMoviesSeries }}>
                <Pagination />
            </PageDataContext.Provider>
        )

        const previousPage = screen.getByTestId("btn-switch-previous-page");

        fireEvent.click(previousPage);

        expect(mockHandlePassToPreviousPage.mock.lastCall[0]).toEqual({ setDataMoviesSeries, dataMoviesSeries });
    })

    it("clicking to initial page", () => {
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = {
            loading: "finnish",
            currentPage: 2,
            totalPages: 12,
        };

        const setDataMoviesSeries = jest.fn()

        render(
            <PageDataContext.Provider value={{ setDataMoviesSeries, dataMoviesSeries }}>
                <Pagination />
            </PageDataContext.Provider>
        )

        const initialPage = screen.getByTestId("btn-switch-initial-page");

        fireEvent.click(initialPage);

        expect(mockHandlePassToStartPage.mock.lastCall[0]).toEqual({ setDataMoviesSeries, dataMoviesSeries });
    })

    it("clicking to end page", () => {
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = {
            loading: "finnish",
            currentPage: 1,
            totalPages: 12,
        };

        const setDataMoviesSeries = jest.fn()

        render(
            <PageDataContext.Provider value={{ setDataMoviesSeries, dataMoviesSeries }}>
                <Pagination />
            </PageDataContext.Provider>
        )

        const endPage = screen.getByTestId("btn-switch-end-page");

        fireEvent.click(endPage);

        expect(mockHandlePassToEndPage.mock.lastCall[0]).toEqual({ setDataMoviesSeries, dataMoviesSeries });
    })

    it("no back page", () => {
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = {
            loading: "finnish",
            currentPage: 1,
            totalPages: 12,
        };

        const setDataMoviesSeries = jest.fn()

        render(
            <PageDataContext.Provider value={{ setDataMoviesSeries, dataMoviesSeries }}>
                <Pagination />
            </PageDataContext.Provider>
        )

        const previousPage = screen.getByTestId("btn-switch-previous-page");

        fireEvent.click(previousPage);

        expect(mockHandlePassToPreviousPage).not.toHaveBeenCalled();
    })

    it("no next page", ()=> {
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = {
            loading: "finnish",
            currentPage: 12,
            totalPages: 12,
        };

        const setDataMoviesSeries = jest.fn()

        render(
            <PageDataContext.Provider value={{ setDataMoviesSeries, dataMoviesSeries }}>
                <Pagination />
            </PageDataContext.Provider>
        )

        const endPage = screen.getByTestId("btn-switch-end-page");

        fireEvent.click(endPage);

        expect(mockHandlePassToEndPage).not.toHaveBeenCalled();
    })
})