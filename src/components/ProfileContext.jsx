"use client";

import React from "react";

const ProfileContext = React.createContext({
  profile: null,
  loading: false,
  error: null,
  refresh: async () => {},
  updateLocal: () => {},
});

export function ProfileProvider({ children, apiBase }) {
  const base =
    apiBase || process.env.NEXT_PUBLIC_NODE_API_URL || "http://localhost:3001";
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${base}/api/profile`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setProfile(null);
        return;
      }
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();
      setProfile(data.profile || null);
    } catch (e) {
      setError(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [base]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const ctxValue = React.useMemo(
    () => ({
      profile,
      loading,
      error,
      refresh: fetchProfile,
      updateLocal: (patch) =>
        setProfile((prev) => ({ ...(prev || {}), ...patch })),
    }),
    [profile, loading, error, fetchProfile]
  );

  return (
    <ProfileContext.Provider value={ctxValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return React.useContext(ProfileContext);
}
