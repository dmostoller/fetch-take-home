import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useBreeds } from "@/hooks/useDogs";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BreedsStepProps {
  onComplete: (breeds: string[]) => void;
}

export function BreedsStep({ onComplete }: BreedsStepProps) {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const { data: breeds, isLoading, error } = useBreeds();

  const filteredBreeds =
    breeds?.filter((breed) =>
      breed.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const handleBreedSelect = (breed: string) => {
    setSelectedBreeds((prev) => {
      if (prev.includes(breed)) {
        return prev.filter((b) => b !== breed);
      }
      if (prev.length >= 10) {
        return prev;
      }
      return [...prev, breed];
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load breeds. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Select your preferred breeds</DialogTitle>
        <DialogDescription>
          Choose up to 10 breeds you&apos;re interested in
        </DialogDescription>
      </DialogHeader>

      <Input
        placeholder="Search breeds..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div className="text-sm text-muted-foreground mb-2">
        {selectedBreeds.length}/10 breeds selected
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-muted animate-pulse rounded-full w-24 mr-2 inline-block"
                />
              ))
            : filteredBreeds.map((breed) => (
                <Badge
                  key={breed}
                  variant={
                    selectedBreeds.includes(breed) ? "default" : "outline"
                  }
                  className={`mr-2 cursor-pointer ${
                    selectedBreeds.length >= 10 &&
                    !selectedBreeds.includes(breed)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleBreedSelect(breed)}
                >
                  {breed}
                </Badge>
              ))}
        </div>
      </ScrollArea>

      <Button className="w-full" onClick={() => onComplete(selectedBreeds)}>
        {selectedBreeds.length > 0
          ? "Continue with selected breeds"
          : "Continue with all breeds"}
      </Button>
    </div>
  );
}
