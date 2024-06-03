import { render } from "@testing-library/react";
import { WatchContextProvider } from "../watch-context";
import "@testing-library/jest-dom";
import React from "react";

const spyState = jest.spyOn(React, "useState");

describe("WatchContextProvider", ()=> {
    beforeEach(()=> jest.clearAllMocks());

    it("initial context state", () => {
        render(<WatchContextProvider/>);

        expect(spyState.mock.results[0].value[0]).toEqual({
            imdbID: "",
            loading: "loading",
            index: 0,
            data: {}
        })
    })

    it("Context state with id params", ()=> {
        const id = "ba76s84kf962";

        const url = new URL(window.location.toString() + "/watch");
        url.searchParams.set("id", id);
        window.history.pushState({}, "", url);

        render(<WatchContextProvider/>);

        expect(spyState.mock.results[0].value[0]).toEqual({
            imdbID: id,
            loading: "loading",
            index: 0,
            data: {}
        });
    })

    it("Context state with id params", ()=> {
        const url = new URL(window.location.toString() + "/watch");
        url.searchParams.set("id", "");
        window.history.pushState({}, "", url);

        render(<WatchContextProvider/>);

        expect(spyState.mock.results[0].value[0]).toHaveProperty("imdbID", "");
    })
})