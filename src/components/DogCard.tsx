import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dog } from "@/lib/types";
import Image from "next/image";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart, HeartOff } from "lucide-react";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
}

export function DogCard({ dog }: DogCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteClick = () => {
    if (isFavorite(dog.id)) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog.id);
    }
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>{dog.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-[200px] w-full">
          <Image
            src={dog.img}
            alt={dog.name}
            fill
            sizes="(min-width: 640px) 300px, 200px"
            className="object-cover rounded-md"
          />
        </div>
        <div className="space-y-2">
          <p>
            <strong>Breed:</strong> {dog.breed}
          </p>
          <p>
            <strong>Age:</strong> {dog.age} years
          </p>
          <p>
            <strong>Location:</strong> {dog.zip_code}
          </p>
          <Button
            onClick={handleFavoriteClick}
            variant={isFavorite(dog.id) ? "default" : "outline"}
            className="w-full flex items-center gap-2"
          >
            {isFavorite(dog.id) ? (
              <>
                <Heart className="h-4 w-4" /> Favorited
              </>
            ) : (
              <>
                <HeartOff className="h-4 w-4" /> Add to Favorites
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
