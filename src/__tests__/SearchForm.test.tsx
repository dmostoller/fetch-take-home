import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { renderWithClient, searchDogs } from "../test/test-utils";
import { Search } from "../components/Search";
import { server } from "../test/mocks/server";

describe("Search", () => {
  const user = userEvent.setup();

  it("renders search form with all fields", () => {
    const mockOnSearch = jest.fn();
    renderWithClient(<Search onSearch={mockOnSearch} />);

    expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid inputs", async () => {
    const mockOnSearch = jest.fn();
    renderWithClient(<Search onSearch={mockOnSearch} />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(await screen.findByText(/breed is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/zip code is required/i),
    ).toBeInTheDocument();
  });

  it("shows loading state while submitting", async () => {
    const mockOnSearch = jest.fn();
    renderWithClient(<Search onSearch={mockOnSearch} />);

    await user.type(screen.getByLabelText(/breed/i), "Golden Retriever");
    await user.type(screen.getByLabelText(/zip code/i), "12345");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(searchButton).toBeDisabled();
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it("handles successful search submission", async () => {
    const mockDogs = [
      { id: 1, name: "Max", breed: "Golden Retriever" },
      { id: 2, name: "Bella", breed: "Golden Retriever" },
    ];

    server.use(
      http.get("/api/dogs", () => {
        return Response.json({
          dogs: mockDogs,
          total: mockDogs.length,
          next: null,
          prev: null,
        });
      }),
    );

    const mockOnSearch = jest.fn();
    renderWithClient(<Search onSearch={mockOnSearch} />);

    await user.type(screen.getByLabelText(/breed/i), "Golden Retriever");
    await user.type(screen.getByLabelText(/zip code/i), "12345");

    await user.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText("Max")).toBeInTheDocument();
      expect(screen.getByText("Bella")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    server.use(
      http.get("/api/dogs", () => {
        return new Response(null, { status: 500 });
      }),
    );

    const params = new URLSearchParams({ breed: "Golden Retriever" });
    await expect(searchDogs(params)).rejects.toThrow("Failed to fetch dogs");

    const mockOnSearch = jest.fn();
    renderWithClient(<Search onSearch={mockOnSearch} />);

    await user.type(screen.getByLabelText(/breed/i), "Golden Retriever");
    await user.type(screen.getByLabelText(/zip code/i), "12345");

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(/error occurred/i)).toBeInTheDocument();
  });
});
