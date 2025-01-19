import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dog } from "@/lib/types";
import Image from "next/image";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart, MapPin } from "lucide-react";

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
    <Card className="w-full max-w-md mx-auto overflow-hidden transition-all hover:shadow-lg">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={dog.img}
          alt={dog.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <CardTitle className="absolute bottom-4 left-4 text-xl sm:text-2xl font-bold text-white">
          {dog.name}
        </CardTitle>
      </div>

      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm font-medium">
              {dog.breed}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {dog.age} {dog.age === 1 ? "year" : "years"} old
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{dog.zip_code}</span>
          </div>
        </div>

        <Button
          onClick={handleFavoriteClick}
          variant={isFavorite(dog.id) ? "secondary" : "default"}
          className="w-full gap-2 font-medium transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite(dog.id) ? "fill-current text-red-500" : "text-current"
            }`}
          />
          {isFavorite(dog.id) ? "Favorited" : "Add to Favorites"}
        </Button>
      </CardContent>
    </Card>
  );
}
