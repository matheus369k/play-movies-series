import { TMoviesInfoWithPagination } from "../../../../types";
import { handlePassToEndPage, handlePassToNextPage, handlePassToPreviousPage, handlePassToStartPage } from "../pagination";


describe("Pagination Functions", () => {
    it("handlePassToNextPage: next 1 page", () => {
        const mockHandlePassToNextPage = jest.fn(handlePassToNextPage);
        const moviesInfoWithPagination: TMoviesInfoWithPagination | undefined = { 
            loading: "finnish", 
            currentPage: 1
        };

        const setMoviesInfoWithPagination = jest.fn();

        mockHandlePassToNextPage({setMoviesInfoWithPagination, moviesInfoWithPagination});

       expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({ loading: 'loading', currentPage: 2 });
    })

    it("handlePassToEndPage: next for the last page", () => {
        const mockHandlePassToEndPage = jest.fn(handlePassToEndPage);
        const moviesInfoWithPagination: TMoviesInfoWithPagination | undefined = { 
            loading: "finnish",
            totalPages: 21, 
            currentPage: 1
        };

        const setMoviesInfoWithPagination = jest.fn();

        mockHandlePassToEndPage({setMoviesInfoWithPagination, moviesInfoWithPagination});

        expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({ loading: 'loading', totalPages: 21 ,currentPage: 21 });
    })

    it("handlePassToPreviousPage: previous 1 page", () => {
        const mockHandlePassToPreviousPage = jest.fn(handlePassToPreviousPage);
        const moviesInfoWithPagination: TMoviesInfoWithPagination | undefined = { 
            loading: "finnish",
            currentPage: 1
        };

        const setMoviesInfoWithPagination = jest.fn();

        mockHandlePassToPreviousPage({setMoviesInfoWithPagination, moviesInfoWithPagination});

        expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({loading: "loading", currentPage: 0});
    })

    it("handlePassToStartPage: previous for the fist page", () => {
        const mockHandlePassToStartPage = jest.fn(handlePassToStartPage);
        const moviesInfoWithPagination: TMoviesInfoWithPagination | undefined = { 
            loading: "finnish",
            currentPage: 21
        };

        const setMoviesInfoWithPagination = jest.fn();

        mockHandlePassToStartPage({setMoviesInfoWithPagination, moviesInfoWithPagination})

        expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({loading: "loading", currentPage: 1});
    })
})