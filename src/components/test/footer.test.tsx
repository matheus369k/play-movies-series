import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom"
import "@testing-library/jest-dom";
import { Footer } from "../footer";

describe("Footer", () => {
    it("should render component", () => {
        render(<Footer />)

        expect(screen.getByText("Filmes e Series")).toBeInTheDocument();
        expect(screen.getByText("Lançamentos")).toBeInTheDocument();
    })
})