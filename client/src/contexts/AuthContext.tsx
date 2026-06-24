import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { User } from "../types";
import { authService } from "../services/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken =
        localStorage.getItem("learnTube_token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);

        const currentUser =
          await authService.getCurrentUser();

        setUser(currentUser);
      } catch (err) {
        console.error(err);

        localStorage.removeItem("learnTube_token");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    setLoading(true);

    try {
      const response = await authService.login(
        email,
        password
      );

      setToken(response.access_token);

      const currentUser =
        await authService.getCurrentUser();

      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    setLoading(true);

    try {
      const response = await authService.register(
        email,
        password,
        name
      );

      setToken(response.access_token);

      const currentUser =
        await authService.getCurrentUser();

      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("learnTube_token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};
