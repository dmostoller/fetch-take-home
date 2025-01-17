import { useEffect, useState } from "react";
import { MatchmakerSelections } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MatchedDog } from "@/components/MatchedDog";
import { useDogsQuery } from "@/hooks/useDogsQuery";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface MatchResultProps {
  selections: MatchmakerSelections;
  onClose: () => void;
  onReset: () => void;
}

export function MatchResult({
  selections,
  onReset,
  onClose,
}: MatchResultProps) {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: dogs, isLoading: isDogsLoading } = useDogsQuery(
    matchId ? [matchId] : [],
  );
  const [isMatching, setIsMatching] = useState(true);

  useEffect(() => {
    async function getMatch() {
      try {
        const response = await fetch("/api/matchmaker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selections),
        });

        if (!response.ok) throw new Error("Failed to find match");
        const { match } = await response.json();
        setMatchId(match);
      } catch (err) {
        setError("No matches found based on your preferences" + err);
      } finally {
        setIsMatching(false);
      }
    }

    getMatch();
  }, [selections]);

  if (isMatching || isDogsLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-4">Finding your perfect match...</p>
      </div>
    );
  }

  if (error || !dogs?.[0]) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">No Perfect Match Found</h3>
            <p className="text-muted-foreground">
              We couldn&apos;t find a match based on your current preferences,
              but don&apos;t worry! There are many wonderful dogs waiting to
              meet you.
            </p>
            <p className="text-sm text-muted-foreground">
              You can browse all available dogs and save your favorites, then
              request a match from your favorites list.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="default" onClick={onClose} className="w-full">
                Browse All Dogs
              </Button>
              <Button variant="outline" onClick={onReset} className="w-full">
                Try Different Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <MatchedDog dog={dogs[0]} onReset={onReset} />;
}
