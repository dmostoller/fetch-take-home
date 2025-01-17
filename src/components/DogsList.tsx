import { useState } from "react";
import { useDogs, useBreeds } from "@/hooks/useDogs";
// import { useLocations } from "@/hooks/useLocations";
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
  // const { data: locations, isLoading: locationsLoading } = useLocations();
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-4 max-w-screen-lg mx-auto">
      <Search
        onSearch={updateSearch}
        breeds={breeds || []}
        defaultValues={params}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            onFavorite={toggleFavorite}
            isFavorite={favorites.has(dog.id)}
          />
        ))}
      </div>

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
