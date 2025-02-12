import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DogCard } from "@/components/DogCard";
import { FavoritesProvider } from "@/context/FavoritesContext";

describe("DogCard", () => {
  const mockDog = {
    id: "dog123",
    name: "Max",
    breed: "Golden Retriever",
    age: 3,
    zip_code: "12345",
    img: "https://example.com/dog.jpg",
  };

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<FavoritesProvider>{ui}</FavoritesProvider>);
  };

  it("renders dog information correctly", () => {
    renderWithProvider(
      <DogCard dog={mockDog} isFavorite={false} onFavorite={() => {}} />,
    );

    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument();
    expect(screen.getByText("3 years old")).toBeInTheDocument();
  });

  it("handles favorite toggle", () => {
    renderWithProvider(
      <DogCard dog={mockDog} isFavorite={false} onFavorite={() => {}} />,
    );

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    // Should show as favorited
    expect(screen.getByRole("button")).toHaveClass("bg-pink-500");
  });
});
