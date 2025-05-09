import { create } from "zustand";
import type { User } from "../types/types";
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from "../utils/localStorage";
import api from "../api/axios";
import { getBearerToken } from "../utils/utils";

interface AuthState {
  user: User | null;
  token: string | null;
  loadingLogin: boolean;
  loadingRegister: boolean;
  loadingAuth: boolean;

  setLoadingLogin: (value: boolean) => void;
  setLoadingRegister: (value: boolean) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: getFromSessionStorage("token") || null,
  loadingLogin: false,
  loadingRegister: false,
  loadingAuth: true,

  setLoadingLogin: (value) => {
    set({ loadingLogin: value });
  },
  setLoadingRegister: (value) => {
    set({ loadingRegister: value });
  },
  setToken: (token) => {
    set({ token });
    saveToSessionStorage("token", token);
  },
  clearAuth: () => {
    set({ token: null, user: null });
  },
  setUser: (user) => {
    set({ user });
  },
  login: async (email, password) => {
    set({ loadingLogin: true });
    const res = await api.post("/auth/login", { email, password });

    get().setUser(res.data.user);
    get().setToken(res.data.token);
  },

  // Register
  register: async (name, email, password) => {
    set({ loadingRegister: true });
    const res = await api.post("/auth/register", { name, email, password });

    get().setUser(res.data.user);
    get().setToken(res.data.token);
  },
  checkAuth: async () => {
    try {
      set({ loadingAuth: true });
      const res = await api.get("/auth/check-auth", {
        headers: {
          ...getBearerToken(),
        },
      });
      set({ user: res.data.user });
    } catch (error: any) {
      console.log("Error in checkAuth: " + error);
    } finally {
      set({ loadingAuth: false });
    }
  },
  logout: () => {
    sessionStorage.removeItem("token");
    get().clearAuth();
  },
}));

export default useAuthStore;
