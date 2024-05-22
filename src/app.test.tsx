import { render } from "@testing-library/react";
import { App } from "./app";

describe("app", () => {
    it("should render", () => {
        render(<App />);
    })
})