import { render, fireEvent, screen } from "@testing-library/react";
import { VideoScreen } from "./video-screen";
import { act } from "react";

describe("VideoScreen", () => {
  const defaultProps = {
    Title: "Test Movie Title",
  };

  it("renders correctly with initial state", () => {
    render(<VideoScreen {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Play" }).parentNode
    ).toBeInTheDocument();
    expect(screen.getByText("Test Movie Title")).toBeVisible();
    expect(screen.getByTitle("Gostei")).toBeVisible();
    expect(screen.getByTitle("Não gostei")).toBeVisible();
    expect(screen.getByText("257")).toBeVisible();
    expect(screen.getByText("45")).toBeVisible();
  });

  it("updates like button state when clicked", () => {
    render(<VideoScreen {...defaultProps} />);
    const likeButton = screen.getByTitle("Gostei");

    act(() => {
      fireEvent.click(likeButton);
    });

    expect(likeButton).toHaveClass("bg-green-500 text-zinc-100");
    expect(likeButton).not.toHaveClass("text-zinc-400 bg-gray-950");
  });

  it("updates dislike button state when clicked", () => {
    render(<VideoScreen {...defaultProps} />);
    const dislikeButton = screen.getByTitle("Não gostei");
    act(() => {
      fireEvent.click(dislikeButton);
    });

    expect(dislikeButton).toHaveClass("bg-red-500 text-zinc-100");
    expect(dislikeButton).not.toHaveClass("text-zinc-400 bg-gray-950");
  });

  it("toggles between like and dislike states", () => {
    render(<VideoScreen {...defaultProps} />);
    const likeButton = screen.getByTitle("Gostei");
    const dislikeButton = screen.getByTitle("Não gostei");

    act(() => {
      fireEvent.click(likeButton);
    });
    expect(likeButton).toHaveClass("bg-green-500 text-zinc-100");
    expect(dislikeButton).not.toHaveClass("bg-red-500 text-zinc-100");

    act(() => {
      fireEvent.click(dislikeButton);
    });
    expect(dislikeButton).toHaveClass("bg-red-500 text-zinc-100");
    expect(likeButton).not.toHaveClass("bg-green-500 text-zinc-100");
  });

  it("renders ButtonPlay component", () => {
    render(<VideoScreen {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("handles long titles without breaking layout", () => {
    const longTitle =
      "This is a very long movie title that should be handled properly with ellipsis";

    render(<VideoScreen Title={longTitle} />);
    const titleElement = screen.getByText(longTitle);

    expect(titleElement).toHaveClass(
      "text-nowrap text-ellipsis overflow-hidden"
    );
  });
});
