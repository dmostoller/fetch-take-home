import { useQuery } from "@tanstack/react-query";
import { Dog } from "@/lib/types";

async function getDogsByIds(dogIds: string[]): Promise<Dog[]> {
  if (!dogIds.length) return [];

  const response = await fetch("/api/dogs/byIds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dogIds),
  });

  if (!response.ok) throw new Error("Failed to fetch dogs");
  return response.json();
}

export function useDogsQuery(dogIds: string[]) {
  return useQuery<Dog[], Error>({
    queryKey: ["dogs", dogIds],
    queryFn: () => getDogsByIds(dogIds),
    enabled: dogIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
