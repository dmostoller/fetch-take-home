"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (dogId: string) => void;
  removeFavorite: (dogId: string) => void;
  isFavorite: (dogId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("dogFavorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addFavorite = (dogId: string) => {
    const newFavorites = [...favorites, dogId];
    setFavorites(newFavorites);
    localStorage.setItem("dogFavorites", JSON.stringify(newFavorites));
  };

  const removeFavorite = (dogId: string) => {
    const newFavorites = favorites.filter((id) => id !== dogId);
    setFavorites(newFavorites);
    localStorage.setItem("dogFavorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (dogId: string) => favorites.includes(dogId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
