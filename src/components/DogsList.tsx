"use client";

import { useState } from "react";
import { useDogs, useBreeds } from "@/hooks/useDogs";
import { DogCardSkeleton } from "./DogCardSkeleton";
import { DogCard } from "./DogCard";
import { Search } from "./Search";
import { SearchParams } from "@/lib/types";
import { Pagination } from "./Pagination";

const DEFAULT_PARAMS: SearchParams = {
  sort: "breed:asc",
  size: 20,
  from: 0,
};

export function DogsList() {
  const [params, setParams] = useState<SearchParams>(DEFAULT_PARAMS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: breeds } = useBreeds();
  const { data, isLoading } = useDogs(params);

  const updateSearch = (newParams: Partial<SearchParams>) => {
    setParams((current) => ({ ...current, ...newParams, from: 0 }));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 px-4 max-w-screen-xl mx-auto mb-6">
      <Search
        onSearch={updateSearch}
        breeds={breeds || []}
        defaultValues={params}
      />

      {isLoading ? (
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <DogCardSkeleton key={index} />
          ))}
        </div>
      ) : data?.dogs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No dogs found, please adjust your search parameters and try again
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {data?.dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              onFavorite={toggleFavorite}
              isFavorite={favorites.has(dog.id)}
            />
          ))}
        </div>
      )}

      <Pagination
        total={data?.total || 0}
        pageSize={params.size || 20}
        current={Math.floor((params.from || 0) / (params.size || 20)) + 1}
        onChange={(page) =>
          setParams((current) => ({
            ...current,
            from: (page - 1) * (current.size || 20),
          }))
        }
      />
    </div>
  );
}
