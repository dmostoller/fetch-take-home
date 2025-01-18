// "use client";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import { useRef, useEffect } from "react";
// import { Check } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "./ui/command";
// import { LocationOption } from "@/lib/types";

// interface VirtualizedLocationsProps {
//   locations: LocationOption[];
//   isLoading: boolean;
//   searchValue: string;
//   onSearchChange: (value: string) => void;
//   selectedValue: string;
//   onSelect: (value: string) => void;
//   hasNextPage?: boolean;
//   fetchNextPage?: () => void;
// }

// export function VirtualizedLocations({
//   locations = [],
//   isLoading,
//   searchValue,
//   onSearchChange,
//   selectedValue,
//   onSelect,
//   hasNextPage,
//   fetchNextPage,
// }: VirtualizedLocationsProps) {
//   const parentRef = useRef<HTMLDivElement>(null);

//   const virtualizer = useVirtualizer({
//     count: hasNextPage ? locations.length + 1 : locations.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 35,
//     overscan: 5,
//   });

//   const lastItemRef = useRef<number>(0);

//   useEffect(() => {
//     const lastItem = virtualizer.getVirtualItems().at(-1);

//     if (!lastItem) return;

//     if (
//       lastItem.index > lastItemRef.current &&
//       lastItem.index > locations.length - 2 &&
//       hasNextPage &&
//       !isLoading
//     ) {
//       lastItemRef.current = lastItem.index;
//       fetchNextPage?.();
//     }
//   }, [
//     virtualizer.getVirtualItems(),
//     hasNextPage,
//     isLoading,
//     locations.length,
//     fetchNextPage,
//   ]);

//   return (
//     <Command>
//       <CommandInput
//         placeholder="Type to search..."
//         value={searchValue}
//         onValueChange={onSearchChange}
//       />
//       <div ref={parentRef} className="max-h-[300px] overflow-auto">
//         <CommandGroup>
//           <div
//             style={{
//               height: `${virtualizer.getTotalSize()}px`,
//               width: "100%",
//               position: "relative",
//             }}
//           >
//             {virtualizer.getVirtualItems().map((virtualRow) => {
//               const location = locations[virtualRow.index];

//               if (!location) {
//                 return hasNextPage ? (
//                   <div
//                     key={`loading-${virtualRow.index}`}
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       width: "100%",
//                       height: `${virtualRow.size}px`,
//                       transform: `translateY(${virtualRow.start}px)`,
//                     }}
//                   >
//                     Loading more...
//                   </div>
//                 ) : null;
//               }

//               return (
//                 <CommandItem
//                   key={location.value}
//                   value={location.value}
//                   onSelect={() => onSelect(location.value)}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: `${virtualRow.size}px`,
//                     transform: `translateY(${virtualRow.start}px)`,
//                   }}
//                 >
//                   {location.label}
//                   <Check
//                     className={cn(
//                       "ml-auto h-4 w-4",
//                       selectedValue === location.value
//                         ? "opacity-100"
//                         : "opacity-0",
//                     )}
//                   />
//                 </CommandItem>
//               );
//             })}
//           </div>
//         </CommandGroup>
//       </div>
//     </Command>
//   );
// }
