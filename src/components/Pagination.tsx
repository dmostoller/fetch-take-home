import { Button } from "@/components/ui/button";

interface PaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
}

export function Pagination({
  total,
  pageSize,
  current,
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 3;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = current - delta; i <= current + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    range.push(totalPages);

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 max-w-screen-md mx-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        Previous
      </Button>

      {getVisiblePages().map((page, idx) =>
        typeof page === "number" ? (
          <Button
            key={idx}
            variant={current === page ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={idx} className="px-2">
            {page}
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
