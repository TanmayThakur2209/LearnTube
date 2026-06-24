import api from "./api";
import type { AuthResponse, User } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    localStorage.setItem(
      "learnTube_token",
      response.data.access_token
    );

    return response.data;
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
      name,
    });

    localStorage.setItem(
      "learnTube_token",
      response.data.access_token
    );

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");

    return response.data;
  },

  logout() {
    localStorage.removeItem("learnTube_token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("learnTube_token");
  },

  async getStats() {
    const response = await api.get("/auth/stats");
    return response.data;
  }
};
