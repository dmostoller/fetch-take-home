"use client";
import { useState } from "react";
import { DogsList } from "@/components/DogsList";
import { LoginForm } from "@/components/login";
import { LogoutButton } from "@/components/logout";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import FavoritesList from "@/components/FavoritesList";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isFavoritesListOpen, setIsFavoritesListOpen] = useState(false);

  const showFavoritesList = () => {
    setIsFavoritesListOpen(!isFavoritesListOpen);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between mb-8">
        <Button variant="link" onClick={showFavoritesList}>
          <span className="font-bold">
            {!isFavoritesListOpen ? "Your Favorites" : "Search Dogs"}
          </span>
        </Button>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthenticated && <LogoutButton />}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto">
        <div className="">
          {!isAuthenticated && <LoginForm />}
          {isAuthenticated && (
            <div className="text-center">
              {/* <h1 className="text-2xl font-bold mb-8">Welcome!</h1> */}
              {isFavoritesListOpen ? <FavoritesList /> : <DogsList />}
            </div>
          )}
        </div>
      </main>

      <footer className="flex gap-6 flex-wrap items-center justify-center mt-8" />
    </div>
  );
}
