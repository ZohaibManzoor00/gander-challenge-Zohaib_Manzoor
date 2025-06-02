'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { User } from "@/db/schema";

export function useUser({ redirectIfNull = true } = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then((data) => {
        if (!data.user && redirectIfNull) {
          router.push("/");
        } else {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (redirectIfNull) router.push("/");
      })
      .finally(() => setLoading(false));
  }, [router, redirectIfNull]);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return { user, loading, logout };
}


