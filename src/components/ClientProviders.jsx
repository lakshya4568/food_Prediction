"use client";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
