import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart, PawPrint, Info, X } from "lucide-react";
import { useDogsQuery } from "@/hooks/useDogsQuery";
import { Button } from "./ui/button";
import { MatchedDog } from "./MatchedDog";
import { Dog } from "@/lib/types";
import Image from "next/image";

const FavoritesList = () => {
  const { favorites } = useFavorites();
  const { data: dogs, isLoading, error } = useDogsQuery(favorites);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

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

  if (isLoading || error || !dogs?.length) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-40">
          {isLoading ? (
            <p>Loading favorites...</p>
          ) : error ? (
            <p className="text-destructive">Error loading favorites</p>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Heart className="w-12 h-12 mb-4 text-muted" />
              <p className="text-lg">No favorites added yet!</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (matchedDog) {
    return <MatchedDog dog={matchedDog} onReset={() => setMatchedDog(null)} />;
  }

  return (
    <div className="w-full max-w-screen-2xl space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="w-6 h-6 text-pink-500" />
              Final Selection ({dogs.length})
            </CardTitle>
            <Button
              size="lg"
              className="bg-gradient-to-t from-[hsl(35,93%,45%)] to-[hsl(35,93%,64%)] hover:from-[hsl(35,93%,40%)] hover:to-[hsl(35,93%,59%)] text-white font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
              onClick={handleMatch}
              disabled={isMatching}
            >
              <PawPrint className="mr-2" />
              {isMatching
                ? "Finding Your Perfect Match..."
                : "Find Your Forever Friend"}
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Review your favorites one last time before finding your perfect
            match!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2">
              {dogs.map((dog) => (
                <Card
                  key={dog.id}
                  className={`group transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1 ${
                    selectedDog?.id === dog.id ? "ring-2 ring-purple-500" : ""
                  }`}
                  onClick={() => setSelectedDog(dog)}
                >
                  <div className="relative">
                    <Image
                      src={dog.img}
                      alt={dog.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
                    >
                      <Info className="w-4 h-4 mr-1" /> View Details
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{dog.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dog.breed} • {dog.age} years old
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDog ? selectedDog.name : "Select a dog for details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDog ? (
                <div className="space-y-4">
                  <Image
                    src={selectedDog.img}
                    alt={selectedDog.name}
                    width={400}
                    height={300}
                    className="w-96 h-96 object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="space-y-2">
                    <p>
                      <strong>Breed:</strong> {selectedDog.breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {selectedDog.age} years
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedDog.zip_code}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setSelectedDog(null)}
                  >
                    <X className="w-4 h-4 mr-2" /> Close Details
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Info className="w-12 h-12 mx-auto mb-4" />
                  <p>Click on a dog to view more details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;
