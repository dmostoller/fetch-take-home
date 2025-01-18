import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const { logout, logoutPending } = useAuth();

  return (
    <Button
      onClick={() => logout()}
      disabled={logoutPending}
      variant="secondary"
    >
      {logoutPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
