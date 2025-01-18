import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/auth";
import { LoginCredentials } from "@/lib/types";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: authApi.check,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Logged in successfully", {
        position: "top-center",
      });
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        position: "top-center",
        description: error.message,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Logged out successfully", {
        position: "top-center",
      });
    },
    onError: (error: Error) => {
      toast.error("Logout failed", {
        position: "top-center",
        description: error.message,
      });
    },
  });

  return {
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginPending: loginMutation.isPending,
    logoutPending: logoutMutation.isPending,
  };
}
