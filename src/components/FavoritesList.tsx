'use client";';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart } from "lucide-react";
import { useDogsQuery } from "@/hooks/useDogsQuery";
import { DogCard } from "@/components/DogCard";
import { Button } from "./ui/button";
import { MatchedDog } from "./MatchedDog";
import { PawPrint } from "lucide-react";
import { Dog } from "@/lib/types";

const FavoritesList = () => {
  const { favorites } = useFavorites();
  const { data: dogs, isLoading, error } = useDogsQuery(favorites);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const handleMatch = async () => {
    try {
      setIsMatching(true);
      const response = await fetch("/api/dogs/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.from(favorites)),
      });

      if (!response.ok) throw new Error("Failed to match");

      const { match } = await response.json();
      const matchedDog = dogs?.find((dog) => dog.id === match);
      if (matchedDog) setMatchedDog(matchedDog);
    } catch (error) {
      console.error("Error matching:", error);
    } finally {
      setIsMatching(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-40">
          <p>Loading favorites...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-destructive">Error loading favorites</p>
        </CardContent>
      </Card>
    );
  }

  if (!dogs?.length) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" /> My Favorites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <p>No favorites added yet!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matchedDog) {
    return <MatchedDog dog={matchedDog} onReset={() => setMatchedDog(null)} />;
  }

  return (
    <Card className="w-full h-full mb-8 max-w-screen-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" /> My Favorites ({dogs.length})
          </CardTitle>
          <Button
            className="font-bold"
            onClick={handleMatch}
            disabled={isMatching}
          >
            <PawPrint className="mr-2" />
            {isMatching ? "Finding Match..." : "Find Your Match"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[700px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={true}
                onFavorite={() => {}}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
