import { AuthResponse, LoginCredentials } from "@/lib/types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  logout: async (): Promise<AuthResponse> => {
    const res = await fetch("/api/auth", { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Logout failed");
    return data;
  },

  check: async (): Promise<boolean> => {
    const res = await fetch("/api/auth/check");
    if (!res.ok) return false;
    const data = await res.json();
    return data.authenticated;
  },
};
