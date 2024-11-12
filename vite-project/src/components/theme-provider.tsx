// ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { host } from "@/App";
import { useWebSocketData } from "./websocket/WebSocketProvider";

export type Theme = "zinc" | "red" | "root" | "blue" | "violet" | "orange" | "green";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  previewTheme: Theme | null;
  setTheme: (theme: Theme) => void;
  setPreviewTheme: (theme: Theme) => void;
  resetPreviewTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "root",
  previewTheme: null,
  setTheme: () => null,
  setPreviewTheme: () => null,
  resetPreviewTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "root",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const resetPreviewTheme = () => {
    setPreviewTheme(null); // Volta ao último tema salvo
  };

  useEffect(() => {
    const fetchSystemPreferences = async () => {
      try {
        const response = await fetch(`${host}/api/systemPreferences`);
        const data = await response.json();
        if (data.theme) {
          setTheme(data.theme as Theme);
          localStorage.setItem(storageKey, data.theme);
        }
      } catch (error) {
        console.error("Failed to fetch system preferences:", error);
      }
    };

    fetchSystemPreferences();
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "zinc", "red", "blue", "violet", "orange", "green");

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const appliedTheme = previewTheme || theme;
    const themeClass = appliedTheme === "root" ? systemTheme : appliedTheme;

    root.classList.add(themeClass);
  }, [theme, previewTheme]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        previewTheme: previewTheme || theme,
        setTheme: (newTheme) => {
          setTheme(newTheme);
          localStorage.setItem(storageKey, newTheme);
        },
        setPreviewTheme,
        resetPreviewTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
