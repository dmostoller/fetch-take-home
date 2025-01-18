import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, CardContent } from "./ui/card";

export function DogCardSkeleton() {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
    >
      <Card className="w-[300px] overflow-hidden">
        <div className="relative h-[250px] w-full">
          <Skeleton height="100%" className="absolute inset-0" />
          <div className="absolute bottom-4 left-4">
            <Skeleton width={140} height={32} />
          </div>
        </div>

        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton width={80} height={24} className="rounded-full" />
              <Skeleton width={70} />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton circle width={16} height={16} />
              <Skeleton width={100} />
            </div>
          </div>
          <Skeleton height={40} className="w-full" />{" "}
        </CardContent>
      </Card>
    </SkeletonTheme>
  );
}
