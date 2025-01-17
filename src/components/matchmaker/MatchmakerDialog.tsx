import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { LocationStep } from "./steps/LocationStep";
import { BreedsStep } from "./steps/BreedsStep";
import { AgeStep } from "./steps/AgeStep";
import { MatchResult } from "./steps/MatchResult";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Home, PawPrint, Calendar, Heart } from "lucide-react";
import { MatchmakerSelections } from "@/lib/types";

const STEPS = [
  { id: "location" as const, label: "Location", icon: Home },
  { id: "breeds" as const, label: "Breeds", icon: PawPrint },
  { id: "age" as const, label: "Age", icon: Calendar },
  { id: "result" as const, label: "Match", icon: Heart },
];

type Step = "location" | "breeds" | "age" | "result";

interface MatchmakerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchmakerDialog({
  open,
  onOpenChange,
}: MatchmakerDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("location");
  const [selections, setSelections] = useState({
    location: "",
    breeds: [] as string[],
    ageRange: "" as "young" | "adult" | "senior" | "",
  });
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const getStepTitle = () => {
    switch (currentStep) {
      case "location":
        return "Choose Your Location";
      case "breeds":
        return "Select Preferred Breeds";
      case "age":
        return "Select Age Range";
      case "result":
        return "Your Perfect Match";
      default:
        return "Find Your Match";
    }
  };

  const handleStepComplete = (
    step: Step,
    data: Partial<MatchmakerSelections>,
  ) => {
    setSelections((prev) => ({ ...prev, ...data }));
    const steps: Step[] = ["location", "breeds", "age", "result"];
    const nextIndex = steps.indexOf(step) + 1;
    setCurrentStep(steps[nextIndex]);
  };

  const handleReset = () => {
    setCurrentStep("location");
    setSelections({
      location: "",
      breeds: [],
      ageRange: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] min-h-96 max-h-screen flex flex-col">
        <DialogHeader>
          <DialogTitle asChild>
            <VisuallyHidden>{getStepTitle()}</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        <Breadcrumb className="flex items-center justify-center w-full mt-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = index < currentStepIndex;

            return (
              <BreadcrumbItem key={step.id} className="flex items-center">
                <BreadcrumbLink
                  className={`
                    flex items-center gap-1 p-1 rounded-md transition-colors
                    ${isActive ? "text-yellow-500 font-medium scale-110" : ""}
                    ${isCompleted ? "text-accent-foreground hover:text-primary" : "text-muted-foreground"}
                    ${index < currentStepIndex ? "cursor-pointer" : "cursor-default"}
                  `}
                  onClick={() =>
                    index < currentStepIndex && setCurrentStep(step.id)
                  }
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-yellow-500" : ""}`}
                  />
                  <span
                    className={`hidden sm:inline text-sm ${isActive ? "text-yellow-500" : ""}`}
                  >
                    {step.label}
                  </span>
                </BreadcrumbLink>
                {index < STEPS.length - 1 && (
                  <span className="mx-2 text-muted-foreground">/</span>
                )}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
        <div className="flex-1 overflow-y-auto min-h-0">
          {currentStep === "location" && (
            <LocationStep
              onComplete={(location) =>
                handleStepComplete("location", { location })
              }
            />
          )}
          {currentStep === "breeds" && (
            <BreedsStep
              onComplete={(breeds) => handleStepComplete("breeds", { breeds })}
            />
          )}
          {currentStep === "age" && (
            <AgeStep
              onComplete={(ageRange) => handleStepComplete("age", { ageRange })}
            />
          )}
          {currentStep === "result" && (
            <MatchResult
              selections={selections}
              onClose={() => onOpenChange(false)}
              onReset={handleReset}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
