'use client";';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart } from "lucide-react";
import { useDogsQuery } from "@/hooks/useDogsQuery";
import { DogCard } from "@/components/DogCard";

const FavoritesList = () => {
  const { favorites } = useFavorites();
  const { data: dogs, isLoading, error } = useDogsQuery(favorites);

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

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" /> My Favorites ({dogs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
