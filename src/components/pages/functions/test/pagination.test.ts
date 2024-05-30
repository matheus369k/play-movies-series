import { TStateDataMoviesSeries } from "../../../../types";
import { handlePassToEndPage, handlePassToNextPage, handlePassToPreviousPage, handlePassToStartPage } from "../pagination";


describe("Pagination Functions", () => {
    it("handlePassToNextPage: next 1 page", () => {
        const mockHandlePassToNextPage = jest.fn(handlePassToNextPage);
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = { 
            loading: "finnish", 
            currentPage: 1
        };

        const setDataMoviesSeries = jest.fn();

        mockHandlePassToNextPage({setDataMoviesSeries, dataMoviesSeries});

       expect(setDataMoviesSeries.mock.lastCall[0]).toEqual({ loading: 'loading', currentPage: 2 });
    })

    it("handlePassToEndPage: next for the last page", () => {
        const mockHandlePassToEndPage = jest.fn(handlePassToEndPage);
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = { 
            loading: "finnish",
            totalPages: 21, 
            currentPage: 1
        };

        const setDataMoviesSeries = jest.fn();

        mockHandlePassToEndPage({setDataMoviesSeries, dataMoviesSeries});

        expect(setDataMoviesSeries.mock.lastCall[0]).toEqual({ loading: 'loading', totalPages: 21 ,currentPage: 21 });
    })

    it("handlePassToPreviousPage: previous 1 page", () => {
        const mockHandlePassToPreviousPage = jest.fn(handlePassToPreviousPage);
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = { 
            loading: "finnish",
            currentPage: 1
        };

        const setDataMoviesSeries = jest.fn();

        mockHandlePassToPreviousPage({setDataMoviesSeries, dataMoviesSeries});

        expect(setDataMoviesSeries.mock.lastCall[0]).toEqual({loading: "loading", currentPage: 0});
    })

    it("handlePassToStartPage: previous for the fist page", () => {
        const mockHandlePassToStartPage = jest.fn(handlePassToStartPage);
        const dataMoviesSeries: TStateDataMoviesSeries | undefined = { 
            loading: "finnish",
            currentPage: 21
        };

        const setDataMoviesSeries = jest.fn();

        mockHandlePassToStartPage({setDataMoviesSeries, dataMoviesSeries})

        expect(setDataMoviesSeries.mock.lastCall[0]).toEqual({loading: "loading", currentPage: 1});
    })
})