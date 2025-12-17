import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "@/services/auth.service";
import type { User, LoginRequest, RegisterRequest } from "@/types/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const isAuth = authService.isAuthenticated();

      if (isAuth && storedUser) {
        setUser(storedUser);

        // Optionally refresh profile from server
        try {
          const freshUser = await authService.getProfile();
          setUser(freshUser);
        } catch (error) {
          console.error("Failed to refresh profile:", error);
          // Token might be expired, logout
          authService.logout();
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    await authService.login(credentials);

    // Fetch user profile after login
    const userProfile = await authService.getProfile();
    setUser(userProfile);
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);

    // Auto-login after registration
    await login({ username: data.email, password: data.password });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    const freshUser = await authService.getProfile();
    setUser(freshUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
