"use client";
import { useState } from "react";
import { DogsList } from "@/components/DogsList";
import { LoginForm } from "@/components/login";
import { LogoutButton } from "@/components/logout";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import FavoritesList from "@/components/FavoritesList";
import { FolderHeart, Search, Dog } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isFavoritesListOpen, setIsFavoritesListOpen] = useState(false);

  const showFavoritesList = () => {
    setIsFavoritesListOpen(!isFavoritesListOpen);
  };

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      {isAuthenticated && (
        <>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-16">
              <Button
                variant="ghost"
                onClick={showFavoritesList}
                className="flex items-center gap-2 text-sm font-medium transition-colors"
              >
                {!isFavoritesListOpen ? (
                  <FolderHeart className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>
                  {!isFavoritesListOpen ? "Your Favorites" : "Search Dogs"}
                </span>
              </Button>

              <div className="flex items-center gap-2">
                <Dog className="h-5 w-5 text-primary hidden sm:block" />
                <h1 className="text-xl font-semibold tracking-tight">
                  Find A Forever Friend
                </h1>
                <Dog className="h-5 w-5 text-primary hidden sm:block" />
              </div>

              <div className="flex items-center gap-2">
                <ModeToggle />
                {isAuthenticated && <LogoutButton />}
              </div>
            </div>
          </header>
        </>
      )}
      <main className="flex-1 flex items-center justify-center w-full max-w-screen-full mx-auto">
        <div className="">
          {!isAuthenticated && <LoginForm />}
          {isAuthenticated && (
            <div className="text-center px-8 max-w-screen-2xl">
              {isFavoritesListOpen ? <FavoritesList /> : <DogsList />}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
