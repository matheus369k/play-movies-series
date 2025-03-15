import type { ReactNode } from "react";
import { Header } from "./header";
import { fireEvent, render } from "@testing-library/react";

jest.mock("./search-form", () => ({
  SearchForm: () => <div>SearchForm</div>,
}));

const mockLocation = jest.fn(() => ({
  pathname: "/",
}));
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useLocation: () => mockLocation(),
  useNavigate: () => mockNavigate,
}));

const mockUseForm = jest.fn();
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: ({ ...props }) => mockUseForm(props),
  FormProvider: ({ children, ...props }: { children: ReactNode }) => (
    <div data-testid="formProvider" {...props}>
      {children}
    </div>
  ),
}));

const mockTopResetScroll = jest.fn();
jest.mock("@/functions", () => ({
  TopResetScroll: () => mockTopResetScroll(),
}));

describe("Header", () => {
  it("should render all hooks correctly", () => {
    render(<Header />);

    expect(mockLocation).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockUseForm).toHaveBeenCalledWith({
      defaultValues: {
        search: "",
      },
    });
  });

  it("should render all components correctly", () => {
    const { getByText, getByTestId } = render(<Header />);

    expect(getByTestId("formProvider")).toBeVisible();
    expect(getByText("SearchForm")).toBeVisible();
  });

  it("should render with correctly class when is search page", () => {
    mockLocation.mockReturnValueOnce({
      pathname: "/play-movies-series/search/dragon-ball-z",
    });

    const { container } = render(<Header />);

    expect(container.firstChild).toHaveClass("fixed bg-gray-950");
    expect(container.firstChild).not.toHaveClass("absolute");
  });

  it("should render with correctly class when is more page", () => {
    mockLocation.mockReturnValueOnce({
      pathname: "/play-movies-series/more",
    });

    const { container } = render(<Header />);

    expect(container.firstChild).toHaveClass("fixed bg-gray-950");
    expect(container.firstChild).not.toHaveClass("absolute");
  });

  it("should render with correctly class when is home page", () => {
    mockLocation.mockReturnValueOnce({
      pathname: "/play-movies-series",
    });

    const { container } = render(<Header />);

    expect(container.firstChild).not.toHaveClass("fixed bg-gray-950");
    expect(container.firstChild).toHaveClass("absolute");
  });

  it("should render with correctly class when is watch page", () => {
    mockLocation.mockReturnValueOnce({
      pathname: "/play-movies-series/watch/tt74673",
    });

    const { container } = render(<Header />);

    expect(container.firstChild).not.toHaveClass("fixed bg-gray-950");
    expect(container.firstChild).toHaveClass("absolute");
  });

  it("should redirection to home page when clicked on the logo", () => {
    const { getByRole } = render(<Header />);
    const button = getByRole("button");

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/play-movies-series");
    expect(mockTopResetScroll).toHaveBeenCalled();
  });

  it("should render logo with correctly classes", () => {
    const { getByRole } = render(<Header />);
    const logo = getByRole("button").firstChild;

    expect(logo).toHaveClass(
      "bg-[url(https://github.com/matheus369k/play-movies-series/blob/main/public/favicon.png?raw=true)] block rounded-md size-10 bg-cover z-50"
    );
  });
});
