import { render } from "@testing-library/react";
import { App } from "./app";
import '@testing-library/jest-dom';

describe("app", () => {
    it("should render of component", () => {
        render(<App />);
    })
})