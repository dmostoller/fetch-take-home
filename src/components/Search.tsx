"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchParams } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocations } from "@/hooks/useLocations";

interface SearchProps {
  onSearch: (params: Partial<SearchParams>) => void;
  breeds?: string[];
  defaultValues?: Partial<SearchParams>;
}

export function Search({ onSearch, breeds = [], defaultValues }: SearchProps) {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [value, setValue] = useState(defaultValues?.breeds?.[0] || "");
  const [locationValue, setLocationValue] = useState<string>(
    defaultValues?.zipCodes?.[0] || "",
  );
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const { data: locations, isLoading } = useLocations(
    locationSearch,
    locationOpen,
  );

  const [ageMin, setAgeMin] = useState<number>(defaultValues?.ageMin || 0);
  const [ageMax, setAgeMax] = useState<number>(defaultValues?.ageMax || 0);

  const breedOptions = breeds.map((breed) => ({
    label: breed,
    value: breed,
  }));

  const locationOptions =
    locations?.results.map((location) => ({
      label: `${location.city}, ${location.state} ${location.zip_code}`,
      value: location.zip_code,
    })) ?? [];

  const handleAgeChange = (type: "min" | "max", value: number) => {
    if (type === "min") {
      setAgeMin(value);
      onSearch({ ...defaultValues, ageMin: value || undefined });
    } else {
      setAgeMax(value);
      onSearch({ ...defaultValues, ageMax: value || undefined });
    }
  };

  return (
    <div className="space-y-4 p-3 bg-card rounded-lg border">
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="sort">Sort</Label>
          <Select
            name="sort"
            defaultValue={defaultValues?.sort || "breed:asc"}
            onValueChange={(value) =>
              onSearch({ sort: value as "breed:asc" | "breed:desc" })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breed:asc">Breed A-Z</SelectItem>
              <SelectItem value="breed:desc">Breed Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort">Breeds</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] justify-between"
              >
                {value
                  ? breedOptions.find((breed) => breed.value === value)?.label
                  : "Select breed..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search breeds..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No breed found.</CommandEmpty>
                  <CommandGroup>
                    {breedOptions
                      .filter((breed) =>
                        breed.label
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((breed) => (
                        <CommandItem
                          key={breed.value}
                          value={breed.value}
                          onSelect={() => {
                            setValue(breed.value);
                            onSearch({ breeds: [breed.value] });
                            setOpen(false);
                          }}
                        >
                          {breed.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === breed.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort">Age</Label>
          <Input
            type="number"
            min={0}
            max={ageMax || undefined}
            value={ageMin}
            onChange={(e) => handleAgeChange("min", Number(e.target.value))}
            placeholder="Min age"
            className="w-[80px]"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="number"
            min={ageMin || 0}
            value={ageMax}
            onChange={(e) => handleAgeChange("max", Number(e.target.value))}
            placeholder="Max age"
            className="w-[80px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="location">Location</Label>
          <Popover
            open={locationOpen}
            onOpenChange={(open) => {
              setLocationOpen(open);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationOpen}
                className="w-[300px] justify-between"
              >
                {locationValue
                  ? locationOptions.find((loc) => loc.value === locationValue)
                      ?.label
                  : "Search by city or state..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Type to search..."
                  value={locationSearch}
                  onValueChange={setLocationSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? "Loading..." : "No locations found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {locationOptions.map((location) => (
                      <CommandItem
                        key={location.value}
                        value={location.value}
                        onSelect={() => {
                          setLocationValue(location.value);
                          onSearch({ zipCodes: [location.value] });
                          setLocationOpen(false);
                        }}
                      >
                        {location.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            locationValue === location.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={
                  !value && ageMin === 0 && ageMax === 0 && !locationValue
                }
                onClick={() => {
                  setValue("");
                  setAgeMin(0);
                  setAgeMax(0);
                  setLocationValue("");
                  setLocationSearch("");
                  onSearch({
                    breeds: [],
                    ageMin: undefined,
                    ageMax: undefined,
                    zipCodes: [],
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Clear Selection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
