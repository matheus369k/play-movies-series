import { render, fireEvent } from "@testing-library/react";
import { SearchForm } from "./search-form";
import { SEARCH_ROUTE } from "@/router/path-routes";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { SearchContextProvider } from "@/context/search-context";
import React from "react";
import type { UseFormType } from "./header";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockTopResetScroll = jest.fn();
jest.mock("@/functions", () => ({
  TopResetScroll: () => mockTopResetScroll(),
}));

const mockHandleUpdateSearch = jest.fn();
jest.spyOn(React, "useContext").mockImplementation(() => ({
  handleUpdateSearch: mockHandleUpdateSearch,
}));

const mockReset = jest.fn();
const mockRegister = jest.fn();
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: () =>
    ({
      handleSubmit: (fn: (data: UseFormType) => void) => {
        fn({
          search: "test search",
        });
      },
      reset: mockReset,
      register: mockRegister,
    } as unknown as UseFormReturn<
      FieldValues,
      unknown,
      FieldValues | undefined
    >),
}));

describe("SearchForm", () => {
  it("should render correctly", () => {
    const { getByRole, getByPlaceholderText, container } = render(
      <SearchContextProvider>
        <SearchForm />
      </SearchContextProvider>
    );

    expect(container.firstChild).toBeVisible();
    expect(getByPlaceholderText("Search...")).toBeVisible();
    expect(getByRole("searchbox").previousSibling).toHaveAttribute(
      "for",
      "search"
    );
    expect(mockRegister).toHaveBeenCalledWith("search");
  });

  it("should call handleSubmitSearchForm corrected when submitted form", () => {
    const { container } = render(
      <SearchContextProvider>
        <SearchForm />
      </SearchContextProvider>
    );

    fireEvent.submit(container.firstChild as Element);

    expect(mockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(":search", "test search")
    );
    expect(mockHandleUpdateSearch).toHaveBeenCalledWith({
      search: "test search",
    });
    expect(mockTopResetScroll).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
