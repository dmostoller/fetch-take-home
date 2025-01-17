import { useQuery } from "@tanstack/react-query";
import { LocationSearchParams, LocationSearchResponse } from "@/lib/types";

const DEFAULT_LOCATION_PARAMS = {
  size: 25,
  from: 0,
};

export function useLocations(params?: LocationSearchParams) {
  // Query for all locations
  const allLocationsQuery = useQuery<LocationSearchResponse>({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
  });

  // Query for filtered locations
  const filteredLocationsQuery = useQuery<LocationSearchResponse>({
    queryKey: ["locations", params],
    queryFn: async () => {
      const response = await fetch("/api/locations/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...DEFAULT_LOCATION_PARAMS, ...params }),
      });
      if (!response.ok) throw new Error("Failed to search locations");
      return response.json();
    },
    enabled: !!params,
  });

  // Return filtered results if params exist, otherwise return all locations
  return params ? filteredLocationsQuery : allLocationsQuery;
}
