"use client";

import React from "react";

const ThemeContext = React.createContext({
  theme: "system", // 'light' | 'dark' | 'system'
  setTheme: () => {},
  resolvedTheme: "light",
});

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children, initialTheme }) {
  const [theme, setThemeState] = React.useState(initialTheme || "system");
  const [resolvedTheme, setResolvedTheme] = React.useState("light");

  const applyTheme = React.useCallback((t) => {
    const root = document.documentElement; // <html>
    const effective = t === "system" ? getSystemTheme() : t;
    setResolvedTheme(effective);
    if (effective === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  const setTheme = React.useCallback(
    (t) => {
      setThemeState(t);
      try {
        localStorage.setItem("nv-theme", t);
      } catch {}
      applyTheme(t);
    },
    [applyTheme]
  );

  // Initialize on mount
  React.useEffect(() => {
    let initial = theme;
    try {
      const stored = localStorage.getItem("nv-theme");
      if (stored) initial = stored;
    } catch {}
    setThemeState(initial);
    applyTheme(initial);

    // Listen to system changes when in system mode
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (initial === "system") applyTheme("system");
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
