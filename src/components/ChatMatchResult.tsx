import { useEffect, useState } from "react";
import { Dog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PawPrint, MapPin, Calendar } from "lucide-react";

interface MatchResultProps {
  selections: {
    location: string;
    breeds: string[];
    ageRange: string;
    matchId: string;
  };
  onClose: () => void;
  onReset: () => void;
}

export function MatchResult({
  selections,
  onClose,
  onReset,
}: MatchResultProps) {
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/dogs/${selections.matchId}`);
        if (!response.ok) throw new Error("Failed to fetch dog");
        const data = await response.json();
        setDog(data);
      } catch (err) {
        setError("Unable to load your match. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDog();
  }, [selections.matchId]);

  if (isLoading) return <div>Loading your perfect match...</div>;
  if (error) return <div>{error}</div>;
  if (!dog) return null;

  return (
    <Card className="mx-4 mb-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={dog.img} alt={dog.name} />
          <AvatarFallback>
            <PawPrint className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{dog.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{dog.breed}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{dog.age} years old</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{dog.zip_code}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}>
          Find Another Match
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}
