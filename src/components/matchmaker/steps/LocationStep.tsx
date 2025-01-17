import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocations } from "@/hooks/useLocations";
import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface LocationStepProps {
  onComplete: (location: string) => void;
}

export function LocationStep({ onComplete }: LocationStepProps) {
  const [search, setSearch] = useState("");
  const { data: locations, isLoading } = useLocations(search, true);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Where are you located?</DialogTitle>
      </DialogHeader>

      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search cities or zip codes..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Loading..." : "No locations found"}
          </CommandEmpty>
          <CommandGroup>
            {locations?.results.map((location) => (
              <CommandItem
                key={location.zip_code}
                onSelect={() => onComplete(location.zip_code)}
              >
                {`${location.city}, ${location.state} ${location.zip_code}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
