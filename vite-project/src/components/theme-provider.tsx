import { createContext, useContext, useEffect, useState } from "react"
import { host } from "@/App"
import { set } from "date-fns"
import { useWebSocketData } from "./websocket/WebSocketProvider"

type Theme = "zinc" | "red" | "root" | "blue"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "root",
  setTheme: () => null,
}


const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "root",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const wss = useWebSocketData();

  useEffect(() => {
    const fetchSystemPreferences = async () => {
      try {
        const response = await fetch(`${host}/api/systemPreferences`)
        const data = await response.json()
        if (data.theme) {
          setTheme(data.theme as Theme)
          localStorage.setItem(storageKey, data.theme)
          console.log(data.theme)
        }
      } catch (error) {
        console.error("Failed to fetch system preferences:", error)
      }
      
    }

    fetchSystemPreferences()
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "root") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeProviderContext)