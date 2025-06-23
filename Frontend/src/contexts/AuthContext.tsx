import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthFormData } from "../types";
import { apiService } from "../config/api";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    credentials: AuthFormData,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    userData: AuthFormData & { photo?: File },
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      apiService.setAuthHeader(token);
      try {
        const fetchedUser = await apiService.getCurrentUser();
        const userData: User = {
          id: fetchedUser._id,
          name: fetchedUser.name,
          phone: fetchedUser.phone,
          role: fetchedUser.role as "user" | "admin",
          storeName: fetchedUser.storeName,
          address: fetchedUser.address,
          photo: fetchedUser.photo,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetchUser = () => {
    setLoading(true);
    fetchUser();
  };

  const login = async (
    credentials: AuthFormData,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { token, user: loggedInUser } = await apiService.login(credentials);
      localStorage.setItem("token", token);
      const userData: User = {
        id: loggedInUser._id,
        name: loggedInUser.name,
        phone: loggedInUser.phone,
        role: loggedInUser.role as "user" | "admin",
        storeName: loggedInUser.storeName,
        address: loggedInUser.address,
        photo: loggedInUser.photo,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      apiService.setAuthHeader(token);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: unknown) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const signup = async (
    userData: AuthFormData & { photo?: File },
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userData.name || !userData.storeName || !userData.address) {
      return { success: false, error: "Missing required fields for signup" };
    }

    try {
      const { token, user: signedUpUser } = await apiService.register({
        name: userData.name,
        phone: userData.phone,
        password: userData.password,
        storeName: userData.storeName,
        address: userData.address,
        photo: userData.photo,
      });
      localStorage.setItem("token", token);
      const newUserData: User = {
        id: signedUpUser._id,
        name: signedUpUser.name,
        phone: signedUpUser.phone,
        role: signedUpUser.role as "user" | "admin",
        storeName: signedUpUser.storeName,
        address: signedUpUser.address,
        photo: signedUpUser.photo,
      };
      localStorage.setItem("user", JSON.stringify(newUserData));
      apiService.setAuthHeader(token);
      setUser(newUserData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      let errorMessage = "Failed to create account. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    apiService.setAuthHeader(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        loading,
        refetchUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
