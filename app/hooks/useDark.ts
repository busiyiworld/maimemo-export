import { useEffect } from "react"
import { useLocalStorage, useMedia } from "react-use"

export declare type ColorScheme = "dark" | "light" | "auto"

export function useDark(key = "color-scheme", defaultColorScheme: ColorScheme = "auto") {
  const [colorScheme, setColorScheme] = useLocalStorage(key, defaultColorScheme)
  const prefersDarkMode = useMedia("(prefers-color-scheme: dark)")
  const isDark = colorScheme === "auto" ? prefersDarkMode : colorScheme === "dark"

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const setDark = (value: ColorScheme) => {
    setColorScheme(value)
  }

  const toggleDark = () => {
    setColorScheme(isDark ? "light" : "dark")
  }

  return { isDark, setDark, toggleDark }
}
