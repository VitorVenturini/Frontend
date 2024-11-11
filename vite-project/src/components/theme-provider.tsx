// ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { host } from "@/App";
import { useWebSocketData } from "./websocket/WebSocketProvider";

export type Theme = "zinc" | "red" | "root" | "blue" | "violet" | "orange" |"green";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  previewTheme: Theme;
  setTheme: (theme: Theme) => void;
  setPreviewTheme: (theme: Theme) => void;
  resetPreviewTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "root",
  previewTheme: "root",
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
  const [previewTheme, setPreviewTheme] = useState<Theme>(theme);
  const wss = useWebSocketData();

  const resetPreviewTheme = () => {
    setPreviewTheme(theme);
  };

  useEffect(() => {
    const fetchSystemPreferences = async () => {
      try {
        const response = await fetch(`${host}/api/systemPreferences`);
        const data = await response.json();
        if (data.theme) {
          setTheme(data.theme as Theme);
          setPreviewTheme(data.theme as Theme);
          localStorage.setItem(storageKey, data.theme);
          console.log(data.theme);
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

    const appliedTheme = previewTheme === "root"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : previewTheme;

    root.classList.add(appliedTheme);
  }, [previewTheme]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        previewTheme,
        setTheme,
        setPreviewTheme,
        resetPreviewTheme
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
