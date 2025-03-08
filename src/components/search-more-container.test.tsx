import { render } from "@testing-library/react";
import { SearchMoreContainer } from "./search-more-container";

describe("SearchMoreContainer", () => {
  test("renders title correctly when children is undefined", () => {
    const { getByText } = render(
      <SearchMoreContainer isFetching={false} title="Test Title" />
    );

    expect(getByText("Test Title")).toBeVisible();
  });

  test("renders title correctly when has children", () => {
    const { getByText } = render(
      <SearchMoreContainer isFetching={false} title="Test Title">
        <div>Child Component</div>
      </SearchMoreContainer>
    );

    expect(getByText("Test Title")).toBeVisible();
  });

  test("renders children when provided", () => {
    const { getByText } = render(
      <SearchMoreContainer isFetching={false} title="Test Title">
        <div>Child Component</div>
      </SearchMoreContainer>
    );

    expect(getByText("Child Component")).toBeVisible();
  });

  test('renders "not found" when no children and not fetching', () => {
    const { getByText } = render(
      <SearchMoreContainer isFetching={false} title="Test Title" />
    );

    expect(getByText("not found")).toBeVisible();
  });

  test('renders "carregando..." when fetching', () => {
    const { getByText } = render(
      <SearchMoreContainer isFetching={true} title="Test Title" />
    );

    expect(getByText("carregando...")).toBeVisible();
  });
});
