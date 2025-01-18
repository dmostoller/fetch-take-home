import { useQuery } from "@tanstack/react-query";
import { LocationSearchParams, LocationSearchResponse } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function useLocations(searchTerm: string = "", isOpen: boolean = false) {
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  return useQuery<LocationSearchResponse>({
    queryKey: ["locations", debouncedSearch],
    queryFn: async () => {
      if (isOpen && !debouncedSearch) {
        const response = await fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ size: 500 }),
        });

        if (!response.ok) throw new Error("Failed to fetch locations");
        return response.json();
      }

      const isStateCode = debouncedSearch.length === 2;

      // Move the length check after state code check
      if (!isStateCode && debouncedSearch.length < 2) {
        return { results: [], total: 0 };
      }

      const params: LocationSearchParams = {
        size: 100,
        ...(isStateCode
          ? { states: [debouncedSearch.toUpperCase()] }
          : { city: debouncedSearch }),
      };

      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Failed to search locations");
      return response.json();
    },
    enabled: isOpen || debouncedSearch.length >= 2,
  });
}
