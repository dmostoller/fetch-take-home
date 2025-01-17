"use client";

import { DogsList } from "@/components/DogsList";
import { useAuth } from "@/hooks/useAuth";
import { MatchmakerButton } from "@/components/matchmaker/MatchmakerButton";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex justify-center w-full max-w-screen-full mx-auto">
        <div>
          {isAuthenticated && (
            <div className="text-center px-8 max-w-screen-2xl">
              <DogsList />
            </div>
          )}
        </div>
      </main>
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-10 hidden md:block">
          <MatchmakerButton />
        </div>
      )}
    </div>
  );
}
