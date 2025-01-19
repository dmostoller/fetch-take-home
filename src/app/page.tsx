"use client";
import { useState } from "react";
import { DogsList } from "@/components/DogsList";
import { LoginForm } from "@/components/Login";
import { useAuth } from "@/hooks/useAuth";
import FavoritesList from "@/components/FavoritesList";
import { Header } from "@/components/Header";
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
          <Header
            showFavoritesList={showFavoritesList}
            isFavoritesListOpen={isFavoritesListOpen}
          />
        </>
      )}
      <main className="flex-1 flex justify-center w-full max-w-screen-full mx-auto">
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
