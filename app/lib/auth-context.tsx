"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import type {
  UserRole,
  User,
  GPProfile,
  LoginResult,
  AuthContextType,
  RegisterData,
} from "@/lib/models";
import { extendPass } from "@/lib/utils/pass";

// TEST_ACCOUNTS moved to auth service - authService handles mock logic and storage

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import * as authService from "./services/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | GPProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (data: RegisterData): Promise<LoginResult> => {
    const res = await authService.register(data);
    if (res.success && res.user) setUser(res.user);
    return res;
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    router.push("/");
  };

  const updatePassValidity = (days = 30) => {
    if (user) {
      const updatedUser = {
        ...user,
        passValidUntil: extendPass(user.passValidUntil, days),
      };
      setUser(updatedUser);
      localStorage.setItem("easycollis_user", JSON.stringify(updatedUser));

      // Mettre à jour aussi dans les comptes enregistrés
      const registeredUsers = JSON.parse(
        localStorage.getItem("easycollis_registered_users") || "{}"
      );
      if (registeredUsers[user.email.toLowerCase()]) {
        registeredUsers[user.email.toLowerCase()].user = updatedUser;
        localStorage.setItem(
          "easycollis_registered_users",
          JSON.stringify(registeredUsers)
        );
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updatePassValidity, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
