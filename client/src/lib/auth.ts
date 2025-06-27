import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: number;
  googleId: string;
  email: string;
  name: string;
  givenName?: string;
  picture?: string;
  lastSignIn: string;
}

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  async logout(): Promise<void> {
    await apiRequest("POST", "/api/auth/logout");
  },

  getGoogleAuthUrl(): string {
    return "/api/auth/google";
  },
};
