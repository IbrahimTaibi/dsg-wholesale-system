import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthFormData } from "../types";
import { apiService } from "../config/api";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: AuthFormData) => Promise<boolean>;
  signup: (userData: AuthFormData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiService.setAuthHeader(token);
      apiService
        .getCurrentUser()
        .then((fetchedUser) => {
          const userData: User = {
            id: fetchedUser._id,
            name: fetchedUser.name,
            phone: fetchedUser.phone,
            role: fetchedUser.role as "user" | "admin",
            storeName: fetchedUser.storeName,
            address: fetchedUser.address,
            avatar: fetchedUser.photo,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setIsAuthenticated(true);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (credentials: AuthFormData) => {
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
        avatar: loggedInUser.photo,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      apiService.setAuthHeader(token);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (userData: AuthFormData) => {
    if (!userData.name || !userData.storeName || !userData.address) {
      throw new Error("Missing fields for signup");
    }
    try {
      const { token, user: signedUpUser } = await apiService.register({
        name: userData.name,
        phone: userData.phone,
        password: userData.password,
        storeName: userData.storeName,
        address: userData.address,
      });
      localStorage.setItem("token", token);
      const newUserData: User = {
        id: signedUpUser._id,
        name: signedUpUser.name,
        phone: signedUpUser.phone,
        role: signedUpUser.role as "user" | "admin",
        storeName: signedUpUser.storeName,
        address: signedUpUser.address,
        avatar: signedUpUser.photo,
      };
      localStorage.setItem("user", JSON.stringify(newUserData));
      apiService.setAuthHeader(token);
      setUser(newUserData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
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
      value={{ isAuthenticated, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
