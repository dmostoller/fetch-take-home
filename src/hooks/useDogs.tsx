import { useQuery } from "@tanstack/react-query";
import { SearchParams, DogsResponse } from "@/lib/types";

export function useDogs(params: SearchParams) {
  return useQuery<DogsResponse>({
    queryKey: ["dogs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach((v) => searchParams.append(key, v));
          }
        } else if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/dogs?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch dogs");
      return response.json();
    },
  });
}

export function useBreeds() {
  return useQuery<string[]>({
    queryKey: ["breeds"],
    queryFn: async () => {
      const response = await fetch("/api/dogs/breeds");
      if (!response.ok) throw new Error("Failed to fetch breeds");
      return response.json();
    },
  });
}
