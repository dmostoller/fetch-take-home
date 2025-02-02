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
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchParams, Location } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocations } from "@/hooks/useLocations";
import dynamic from "next/dynamic";
import { Drawer } from "vaul";
import { Search as SearchIcon } from "lucide-react";
import { MatchmakerButton } from "./matchmaker/MatchmakerButton";

const Map = dynamic(() => import("./Map").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <Button variant="outline" disabled>
      Loading Map...
    </Button>
  ),
});

interface ZipCodeEntry {
  code: string;
  label: string;
}

interface SearchProps {
  onSearch: (params: Partial<SearchParams>) => void;
  breeds?: string[];
  defaultValues?: Partial<SearchParams>;
}

export function Search({ onSearch, breeds = [], defaultValues }: SearchProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [breedDrawerOpen, setBreedDrawerOpen] = useState(false);
  const [locationDrawerOpen, setLocationDrawerOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [value, setValue] = useState(defaultValues?.breeds?.[0] || "");
  const [locationValue, setLocationValue] = useState<string>(
    defaultValues?.zipCodes?.[0] || "",
  );
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const { data: locations, isLoading } = useLocations(
    locationSearch,
    locationOpen || locationDrawerOpen,
  );
  // console.log("Locations data:", locations);
  const [ageMin, setAgeMin] = useState<number>(defaultValues?.ageMin || 0);
  const [ageMax, setAgeMax] = useState<number>(defaultValues?.ageMax || 0);
  const [selectedZipCodes, setSelectedZipCodes] = useState<
    Array<{
      code: string;
      label: string;
    }>
  >([]);
  const breedOptions = breeds.map((breed) => ({
    label: breed,
    value: breed,
  }));

  const locationOptions =
    locations?.results.map((location) => ({
      label: `${location.city}, ${location.state} ${location.zip_code}`,
      value: location.zip_code,
    })) ?? [];

  const handleZipCodeSelect = (zipCode: string, label: string) => {
    if (selectedZipCodes.length >= 10) return;

    if (!selectedZipCodes.find((z) => z.code === zipCode)) {
      const newZipCodes = [...selectedZipCodes, { code: zipCode, label }];
      setSelectedZipCodes(newZipCodes);
      onSearch({ zipCodes: newZipCodes.map((z) => z.code) });
    }
  };

  const removeZipCode = (zipCode: string) => {
    const newZipCodes = selectedZipCodes.filter((z) => z.code !== zipCode);
    setSelectedZipCodes(newZipCodes);
    onSearch({ zipCodes: newZipCodes.map((z) => z.code) });
  };

  // console.log("Location options:", locationOptions);

  const handleAgeChange = (type: "min" | "max", value: number) => {
    if (type === "min") {
      setAgeMin(value);
      onSearch({ ...defaultValues, ageMin: value || undefined });
    } else {
      setAgeMax(value);
      onSearch({ ...defaultValues, ageMax: value || undefined });
    }
  };

  const searchContent = (
    <div className="flex gap-4 flex-wrap justify-center">
      {/* SORT BY SECTION */}
      <div className="flex items-center gap-2">
        <Label htmlFor="sort">Sort by</Label>
        <Select
          name="sort"
          aria-label="Sort"
          defaultValue={defaultValues?.sort || "breed:asc"}
          onValueChange={(value) =>
            onSearch({ sort: value as "breed:asc" | "breed:desc" })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breed:asc">Breed A-Z</SelectItem>
            <SelectItem value="breed:desc">Breed Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* BREED COMBOBOX SECTION */}
      <div className="flex items-center gap-2">
        <Label htmlFor="breeds">Breeds</Label>
        <div className="block md:hidden">
          <Drawer.Root open={breedDrawerOpen} onOpenChange={setBreedDrawerOpen}>
            <Drawer.Trigger asChild>
              <Button
                variant="outline"
                className="w-[250px] justify-between"
                onClick={() => setBreedDrawerOpen(true)}
              >
                {value
                  ? breedOptions.find((breed) => breed.value === value)?.label
                  : "Select breed..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-[60]">
                <div className="p-6 rounded-t-[10px] flex-1 overflow-y-auto">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
                  <Drawer.Title>Select Breed</Drawer.Title>
                  <Drawer.Description className="mb-2">
                    Choose a dog breed from the list below
                  </Drawer.Description>
                  <Command>
                    <CommandInput
                      placeholder="Search breeds..."
                      value={search}
                      onValueChange={setSearch}
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
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
        <div className="hidden md:block flex-1">
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
            <PopoverContent
              className="w-[250px] p-0 z-[100]"
              side="bottom"
              align="start"
              sideOffset={4}
              avoidCollisions={true}
              forceMount
            >
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
      </div>

      {/* AGE SELECT SECTION */}
      <div className="flex items-center gap-2">
        <Label htmlFor="age">Age</Label>
        <Input
          type="number"
          min={0}
          max={ageMax || undefined}
          value={ageMin}
          onChange={(e) => handleAgeChange("min", Number(e.target.value))}
          placeholder="Min age"
          className="w-[60px]"
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="number"
          min={ageMin || 0}
          value={ageMax}
          onChange={(e) => handleAgeChange("max", Number(e.target.value))}
          placeholder="Max age"
          className="w-[60px]"
        />
      </div>

      {/* LOCATION COMBOBOX SECTION */}
      <div className="flex items-center gap-2">
        <Label htmlFor="location">Location</Label>
        <div className="block md:hidden">
          <Drawer.Root
            open={locationDrawerOpen}
            onOpenChange={setLocationDrawerOpen}
          >
            <Drawer.Trigger asChild>
              <Button
                variant="outline"
                className="w-[220px] justify-between"
                onClick={() => setLocationDrawerOpen(true)}
              >
                {locationValue
                  ? locationOptions.find((loc) => loc.value === locationValue)
                      ?.label
                  : "Search by city or state..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-[60]">
                <div className="p-6 rounded-t-[10px] flex-1 overflow-y-auto">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
                  <Drawer.Title>Select Location</Drawer.Title>
                  <Drawer.Description className="mb-2">
                    Search for a city, state or zip code
                  </Drawer.Description>
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput
                      placeholder="Type to search..."
                      value={locationSearch}
                      onValueChange={(value) => {
                        setLocationSearch(value);
                        if (!locationDrawerOpen) {
                          setLocationDrawerOpen(true);
                        }
                      }}
                    />
                    <div className="border-t border-gray-200">
                      <CommandList>
                        <CommandEmpty>
                          {isLoading ? "Loading..." : "No locations found."}
                        </CommandEmpty>
                        {locationOptions.length > 0 && (
                          <CommandGroup>
                            {locationOptions.map((location) => (
                              <CommandItem
                                key={location.value}
                                onSelect={() => {
                                  handleZipCodeSelect(
                                    location.value,
                                    location.label,
                                  );
                                  setLocationDrawerOpen(false);
                                }}
                              >
                                {location.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </div>
                  </Command>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
        <div className="hidden md:block flex-1">
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
                className="w-[220px] justify-between"
              >
                {locationValue
                  ? locationOptions.find((loc) => loc.value === locationValue)
                      ?.label
                  : "Search by city or state..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0 z-[100]">
              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Type to search..."
                  value={locationSearch}
                  onValueChange={(value) => {
                    setLocationSearch(value);
                    if (!locationOpen) {
                      setLocationOpen(true);
                    }
                  }}
                />
                <div className="border-t border-gray-200">
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? "Loading..." : "No locations found."}
                    </CommandEmpty>
                    {locationOptions.length > 0 && (
                      <CommandGroup>
                        {locationOptions.map((location) => (
                          <CommandItem
                            key={location.value}
                            onSelect={() => {
                              handleZipCodeSelect(
                                location.value,
                                location.label,
                              );
                              setLocationOpen(false);
                            }}
                          >
                            {location.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Map
        onBoundsSelect={async (bounds) => {
          const response = await fetch("/api/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              geoBoundingBox: bounds,
              size: 100,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const newZipCodes: ZipCodeEntry[] = data.results.map(
              (loc: Location) => ({
                code: loc.zip_code,
                label: `${loc.city}, ${loc.state} ${loc.zip_code}`,
              }),
            );
            setSelectedZipCodes(newZipCodes);
            onSearch({
              zipCodes: newZipCodes.map((z: ZipCodeEntry) => z.code),
            });
          }
        }}
      />
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={
                !value &&
                ageMin === 0 &&
                ageMax === 0 &&
                !locationValue &&
                selectedZipCodes.length === 0 &&
                !locationSearch
              }
              onClick={() => {
                setValue("");
                setAgeMin(0);
                setAgeMax(0);
                setLocationValue("");
                setLocationSearch("");
                setSelectedZipCodes([]);
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
  );

  return (
    <>
      <div className="md:hidden">
        <Button
          size="icon"
          className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-200 z-50 mb-safe"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open search filters"
        >
          <SearchIcon className="h-8 w-8" />
        </Button>
        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 h-[90vh] max-h-[90vh] z-40">
              <div className="p-6 rounded-t-[10px] flex-1 overflow-y-auto">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
                <div className="flex justify-between items-center mb-6">
                  <Drawer.Title className="text-xl font-semibold">
                    Search Filters
                  </Drawer.Title>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Drawer.Description className="text-sm text-muted-foreground mb-6">
                  Customize your search using the filters below
                </Drawer.Description>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6 p-4 bg-card rounded-lg border">
                    {searchContent}
                    {selectedZipCodes.length > 0 && (
                      <div className="w-full flex justify-center flex-wrap gap-2">
                        {selectedZipCodes.map((zip) => (
                          <Badge key={zip.code} variant="secondary">
                            {zip.label}
                            <button
                              className="ml-1 hover:text-destructive"
                              onClick={() => removeZipCode(zip.code)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        or
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 text-center space-y-4 p-6 bg-card/50 rounded-lg border border-dashed">
                    <h3 className="font-semibold text-lg">
                      Let Us Find Your Perfect Match
                    </h3>
                    <p className="text-muted-foreground">
                      Answer a few quick questions and our smart matchmaker will
                      find your ideal furry companion
                    </p>
                    <MatchmakerButton disableGradients={true} />
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      <div className="hidden md:block">
        <div className="space-y-4 p-3 bg-card rounded-lg border">
          {searchContent}
          {selectedZipCodes.length > 0 && (
            <div className="w-full flex justify-center flex-wrap gap-2">
              {selectedZipCodes.map((zip) => (
                <Badge key={zip.code} variant="secondary">
                  {zip.label}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => removeZipCode(zip.code)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
