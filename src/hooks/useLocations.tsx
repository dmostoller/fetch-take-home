import { useQuery } from "@tanstack/react-query";
import { LocationSearchParams, LocationSearchResponse } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function useLocations(searchTerm: string = "", isOpen: boolean = false) {
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  return useQuery<LocationSearchResponse>({
    queryKey: ["locations", debouncedSearch],
    queryFn: async () => {
      if (!isOpen) return { results: [], total: 0 };

      const params: LocationSearchParams = {
        size: 1000,
        ...(debouncedSearch.length === 2
          ? { states: [debouncedSearch.toUpperCase()] }
          : debouncedSearch.length > 2
            ? { city: debouncedSearch }
            : {}),
      };

      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Failed to search locations");
      return response.json();
    },
    enabled: isOpen,
    staleTime: 1000,
  });
}
