import { screen } from "@testing-library/dom";
import { render, fireEvent } from "@testing-library/react";
import { Pagination } from "../pagination";
import "@testing-library/dom";
import React from "react";
import { TMoviesInfoWithPagination } from "../../../../types";
import { PaginationContextProvider } from "../../../../context/pagination-context";

interface PropsMock {
    moviesInfoWithPagination?: TMoviesInfoWithPagination | undefined
    setMoviesInfoWithPagination?: React.Dispatch<React.SetStateAction<TMoviesInfoWithPagination>> | undefined
}

const mockHandlePassToEndPage = jest.fn();
const mockHandlePassToStartPage = jest.fn();
const mockHandlePassToNextPage = jest.fn();
const mockHandlePassToPreviousPage = jest.fn();

const spyState = jest.spyOn(React, "useState");


jest.mock("../../functions/pagination", () => ({
    handlePassToNextPage: ({ 
        moviesInfoWithPagination, 
        setMoviesInfoWithPagination 
    }: PropsMock) => mockHandlePassToNextPage({moviesInfoWithPagination, setMoviesInfoWithPagination}),
    handlePassToStartPage: ({
        moviesInfoWithPagination, 
        setMoviesInfoWithPagination
    }: PropsMock) => mockHandlePassToStartPage({moviesInfoWithPagination, setMoviesInfoWithPagination}),
    handlePassToPreviousPage: ({
        moviesInfoWithPagination, 
        setMoviesInfoWithPagination
    }: PropsMock) => mockHandlePassToPreviousPage({moviesInfoWithPagination, setMoviesInfoWithPagination}),
    handlePassToEndPage: ({ 
        moviesInfoWithPagination, 
        setMoviesInfoWithPagination 
    }: PropsMock) => mockHandlePassToEndPage({moviesInfoWithPagination, setMoviesInfoWithPagination})
}))

describe("Pagination Component", () => {
    beforeEach(()=> jest.clearAllMocks())

    it("clicking to next 1 page", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            loading: "finnish",
            currentPage: 1,
            totalPages: 12,
        };

        const setMoviesInfoWithPagination = jest.fn()

        spyState.mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <PaginationContextProvider>
                <Pagination />
            </PaginationContextProvider>
        )

        const nextPage = screen.getByTestId("btn-switch-next-page");

        fireEvent.click(nextPage);

        expect(mockHandlePassToNextPage.mock.lastCall[0]).toEqual({ 
            moviesInfoWithPagination, 
            setMoviesInfoWithPagination 
        });
    })

    it("clicking to previous 1 page", ()=> {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            loading: "finnish",
            currentPage: 2,
            totalPages: 12,
        };

        const setMoviesInfoWithPagination = jest.fn()

        spyState.mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <PaginationContextProvider>
                <Pagination />
            </PaginationContextProvider>
        )

        const previousPage = screen.getByTestId("btn-switch-previous-page");

        fireEvent.click(previousPage);

        expect(mockHandlePassToPreviousPage.mock.lastCall[0]).toEqual({ moviesInfoWithPagination, setMoviesInfoWithPagination });
    })

    it("clicking to initial page", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            loading: "finnish",
            currentPage: 2,
            totalPages: 12,
        };

        const setMoviesInfoWithPagination = jest.fn()

        spyState.mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <PaginationContextProvider>
                <Pagination />
            </PaginationContextProvider>
        )

        const initialPage = screen.getByTestId("btn-switch-initial-page");

        fireEvent.click(initialPage);

        expect(mockHandlePassToStartPage.mock.lastCall[0]).toEqual({ moviesInfoWithPagination, setMoviesInfoWithPagination });
    })

    it("clicking to end page", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            loading: "finnish",
            currentPage: 1,
            totalPages: 12,
        };

        const setMoviesInfoWithPagination = jest.fn()

        spyState.mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <PaginationContextProvider>
                <Pagination />
            </PaginationContextProvider>
        )

        const endPage = screen.getByTestId("btn-switch-end-page");

        fireEvent.click(endPage);

        expect(mockHandlePassToEndPage.mock.lastCall[0]).toEqual({ moviesInfoWithPagination, setMoviesInfoWithPagination });
    })

    it("no back page", () => {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            loading: "finnish",
            currentPage: 1,
            totalPages: 12,
        };

        const setMoviesInfoWithPagination = jest.fn()

        spyState.mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <PaginationContextProvider>
                <Pagination />
            </PaginationContextProvider>
        )
        const previousPage = screen.getByTestId("btn-switch-previous-page");

        fireEvent.click(previousPage);

        expect(mockHandlePassToPreviousPage).not.toHaveBeenCalled();
    })

    it("no next page", ()=> {
        const moviesInfoWithPagination: TMoviesInfoWithPagination = {
            loading: "finnish",
            currentPage: 12,
            totalPages: 12,
        };

        const setMoviesInfoWithPagination = jest.fn()

        spyState.mockImplementationOnce(() => [moviesInfoWithPagination, setMoviesInfoWithPagination])

        render(
            <PaginationContextProvider>
                <Pagination />
            </PaginationContextProvider>
        )

        const endPage = screen.getByTestId("btn-switch-end-page");

        fireEvent.click(endPage);

        expect(mockHandlePassToEndPage).not.toHaveBeenCalled();
    })
})