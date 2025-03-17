import { render } from "@testing-library/react";
import { RootLayout } from "./index";
import { QueryClient } from "@tanstack/react-query";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: jest.fn(() => <div data-testid="mock-outlet">Outlet Content</div>),
}));
jest.mock("@/components/header", () => ({
  Header: jest.fn(() => <div data-testid="header">Header Content</div>),
}));
jest.mock("@/components/footer", () => ({
  Footer: jest.fn(() => <div data-testid="footer">Footer Content</div>),
}));
jest.mock("@/context/search-context", () => ({
  SearchContextProvider: jest.fn(({ children }) => (
    <div data-testid="search-context">{children}</div>
  )),
}));
jest.mock("@/context/watch-context", () => ({
  WatchContextProvider: jest.fn(({ children }) => (
    <div data-testid="watch-context">{children}</div>
  )),
}));
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  QueryClientProvider: jest.fn(({ children, ...props }) => (
    <div data-testid="query-client" data-client={JSON.stringify(props.client)}>
      {children}
    </div>
  )),
}));

describe("Root", () => {
  it("renders without crashing", () => {
    const { container } = render(<RootLayout />);

    expect(container).toBeInTheDocument();
  });

  it("renders the Outlet component", () => {
    const { getByTestId } = render(<RootLayout />);
    const outletElement = getByTestId("mock-outlet");

    expect(outletElement).toBeInTheDocument();
    expect(outletElement).toHaveTextContent("Outlet Content");
  });

  it("renders the Header component", () => {
    const { getByTestId } = render(<RootLayout />);

    expect(getByTestId("header")).toBeInTheDocument();
  });

  it("renders the Footer component", () => {
    const { getByTestId } = render(<RootLayout />);

    expect(getByTestId("footer")).toBeInTheDocument();
  });

  it("renders the QueryClientProvider", () => {
    const { getByTestId } = render(<RootLayout />);
    const queryClientElement = getByTestId("query-client");

    expect(queryClientElement).toHaveAttribute(
      "data-client",
      JSON.stringify(new QueryClient())
    );
    expect(queryClientElement).toEqual(
      getByTestId("watch-context").parentNode?.parentNode
    );
  });

  it("renders the SearchContextProvider", () => {
    const { getByTestId, getByRole } = render(<RootLayout />);
    const searchContextElement = getByTestId("search-context");

    expect(searchContextElement).toBeVisible();
    expect(searchContextElement).toEqual(
      getByTestId("header").parentNode && getByRole("main").parentNode
    );
  });

  it("renders the WatchContextProvider", () => {
    const { getByTestId } = render(<RootLayout />);
    const watchContextElement = getByTestId("watch-context");

    expect(watchContextElement).toBeVisible();
    expect(watchContextElement).toEqual(
      getByTestId("search-context").parentNode
    );
  });
});
