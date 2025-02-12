import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoritesList from "@/components/FavoritesList";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("FavoritesList Integration", () => {
  const queryClient = new QueryClient();

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>{ui}</FavoritesProvider>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    // Mock API responses
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Max",
              breed: "Labrador",
              age: 3,
              img: "test.jpg",
              zip_code: "12345",
            },
          ]),
      }),
    );
  });

  it("loads and displays favorite dogs", async () => {
    renderWithProviders(<FavoritesList />);

    await waitFor(() => {
      expect(screen.getByText("Max")).toBeInTheDocument();
      expect(screen.getByText("Labrador • 3 years old")).toBeInTheDocument();
    });
  });

  it("handles match generation", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ match: "1" }),
      }),
    );

    renderWithProviders(<FavoritesList />);

    const matchButton = await screen.findByText(/Find Your Forever Friend/i);
    fireEvent.click(matchButton);

    await waitFor(() => {
      expect(screen.getByText(/Congratulations/i)).toBeInTheDocument();
    });
  });
});
