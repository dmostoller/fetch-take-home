"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { logout, logoutPending } = useAuth();

  return (
    <Button
      onClick={() => logout()}
      disabled={logoutPending}
      variant="secondary"
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      {logoutPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
