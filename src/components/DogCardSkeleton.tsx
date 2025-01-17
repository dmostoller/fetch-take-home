import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, CardContent } from "./ui/card";

export function DogCardSkeleton() {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
    >
      <Card className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)] overflow-hidden">
        <div className="relative w-full aspect-[4/4]">
          <Skeleton height="100%" className="absolute inset-0" />
          <div className="absolute bottom-4 left-4">
            <Skeleton width={140} height={32} />
          </div>
        </div>

        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Skeleton width={100} height={24} className="rounded-full" />
              <Skeleton width={80} />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton circle width={16} height={16} />
              <Skeleton width={80} />
            </div>
          </div>

          <Skeleton height={40} className="w-full" />
        </CardContent>
      </Card>
    </SkeletonTheme>
  );
}
