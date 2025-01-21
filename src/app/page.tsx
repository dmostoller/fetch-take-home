"use client";

import LandingPage from "@/components/Landing";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex justify-center w-full mx-auto">
        <LandingPage />
      </main>
    </div>
  );
}
