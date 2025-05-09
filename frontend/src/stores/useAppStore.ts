import { create } from "zustand";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

interface AppState {
  theme: string;
  toggleTheme: () => void;
}

const useAppStore = create<AppState>((set, get) => ({
  theme: getFromLocalStorage("theme") || "light",

  toggleTheme: () => {
    const { theme } = get();
    const newTheme = theme === "light" ? "dark" : "light";

    set({ theme: newTheme });
    saveToLocalStorage("theme", newTheme);
  },
}));

export default useAppStore;
