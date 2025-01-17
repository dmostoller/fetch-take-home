import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Baby, Dog, PawPrint } from "lucide-react";
import { useState } from "react";

interface AgeStepProps {
  onComplete: (age: "young" | "adult" | "senior") => void;
}

const AGE_OPTIONS = [
  {
    value: "young",
    label: "Young",
    description: "0-2 years",
    icon: Baby,
  },
  {
    value: "adult",
    label: "Adult",
    description: "2-8 years",
    icon: Dog,
  },
  {
    value: "senior",
    label: "Senior",
    description: "8+ years",
    icon: PawPrint,
  },
] as const;

export function AgeStep({ onComplete }: AgeStepProps) {
  const [selected, setSelected] = useState<"young" | "adult" | "senior">();

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>What age range do you prefer?</DialogTitle>
      </DialogHeader>

      <RadioGroup
        onValueChange={(value: "young" | "adult" | "senior") =>
          setSelected(value)
        }
        className="grid grid-cols-1 gap-4"
      >
        {AGE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <Label
              key={option.value}
              htmlFor={option.value}
              className={`
                flex flex-col items-center justify-center p-6 rounded-xl border-2
                transition-all duration-200 cursor-pointer
                hover:bg-accent hover:border-primary
                ${
                  selected === option.value
                    ? "border-primary bg-accent shadow-sm"
                    : "border-border bg-card"
                }
              `}
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="sr-only"
              />
              <Icon
                className={`
                  h-12 w-12 mb-3 transition-colors duration-200
                  ${selected === option.value ? "text-primary" : "text-muted-foreground"}
                `}
              />
              <span className="text-lg font-medium text-foreground mb-1">
                {option.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {option.description}
              </span>
            </Label>
          );
        })}
      </RadioGroup>

      <Button
        className="w-full"
        onClick={() => selected && onComplete(selected)}
        disabled={!selected}
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
}
