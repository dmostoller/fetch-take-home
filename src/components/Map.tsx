"use client";
import { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  useMapEvents,
} from "react-leaflet";
import { LatLngBounds, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface MapProps {
  onBoundsSelect: (bounds: {
    top_right: { lat: number; lon: number };
    bottom_left: { lat: number; lon: number };
  }) => void;
}

function BoundingBox({
  onBoundsChange,
  isAreaInvalid,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
  isAreaInvalid: boolean;
}) {
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<LatLng | null>(null);
  const [selectedBounds, setSelectedBounds] = useState<LatLngBounds | null>(
    null,
  );

  useMapEvents({
    mousedown(e) {
      setStartPoint(e.latlng);
      setEndPoint(null);
      setSelectedBounds(null);
    },
    mousemove(e) {
      if (startPoint) {
        setEndPoint(e.latlng);
      }
    },
    mouseup(e) {
      if (startPoint) {
        const bounds = new LatLngBounds(startPoint, e.latlng);
        setSelectedBounds(bounds);
        onBoundsChange(bounds);
        setStartPoint(null);
        setEndPoint(null);
      }
    },
  });

  return (
    <>
      {startPoint && endPoint && (
        <Rectangle
          bounds={new LatLngBounds(startPoint, endPoint)}
          pathOptions={{ color: isAreaInvalid ? "red" : "blue", weight: 1 }}
        />
      )}
      {selectedBounds && (
        <Rectangle
          bounds={selectedBounds}
          pathOptions={{
            color: isAreaInvalid ? "red" : "blue",
            weight: 2,
            fillOpacity: 0.2,
          }}
        />
      )}
    </>
  );
}
const Map = ({ onBoundsSelect }: MapProps) => {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [open, setOpen] = useState(false);
  const [isAreaTooLarge, setIsAreaTooLarge] = useState(false);
  const [isAreaTooSmall, setIsAreaTooSmall] = useState(false);

  const checkAreaSize = (bounds: LatLngBounds) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const width = Math.abs(ne.lng - sw.lng);
    const height = Math.abs(ne.lat - sw.lat);
    const area = width * height;

    const MAX_AREA = 2.1; // ~100mi x 100mi
    const MIN_AREA = 0.0002; // ~1mi x 1mi

    if (area > MAX_AREA) {
      setIsAreaTooLarge(true);
      setIsAreaTooSmall(false);
      return false;
    } else if (area < MIN_AREA) {
      setIsAreaTooLarge(false);
      setIsAreaTooSmall(true);
      return false;
    }

    setIsAreaTooLarge(false);
    setIsAreaTooSmall(false);
    return true;
  };

  const handleBoundsChange = useCallback((newBounds: LatLngBounds) => {
    setBounds(newBounds);
    checkAreaSize(newBounds);
  }, []);

  const isAreaInvalid = isAreaTooLarge || isAreaTooSmall;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setBounds(null);
          setIsAreaTooLarge(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Select Area on Map</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Area</DialogTitle>
          <DialogDescription>
            Hold the{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              SHIFT
            </kbd>{" "}
            key and drag on the map to select an area. Selected zip codes will
            be used to filter dogs.
            {isAreaTooLarge && (
              <span className="block text-destructive mt-2">
                Selected area is too large. Please select a smaller area
                (roughly state-sized or smaller).
              </span>
            )}
            {isAreaTooSmall && (
              <span className="block text-destructive mt-2">
                Please drag to select an area. Single clicks are not supported.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[500px] w-full">
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <BoundingBox
              onBoundsChange={handleBoundsChange}
              isAreaInvalid={isAreaInvalid}
            />
          </MapContainer>
        </div>
        <Button
          onClick={() => {
            if (bounds && !isAreaInvalid) {
              const ne = bounds.getNorthEast();
              const sw = bounds.getSouthWest();
              onBoundsSelect({
                top_right: { lat: ne.lat, lon: ne.lng },
                bottom_left: { lat: sw.lat, lon: sw.lng },
              });
              setOpen(false);
            }
          }}
          disabled={!bounds || isAreaInvalid}
          variant={isAreaInvalid ? "destructive" : "default"}
        >
          {isAreaTooLarge
            ? "Area Too Large"
            : isAreaTooSmall
              ? "Area Too Small"
              : "Use Selected Area"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Map;
