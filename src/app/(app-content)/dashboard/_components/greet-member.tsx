"use client";

import { useUser } from "@/hooks/use-user";

export default function GreetMember() {
  const { user, loading } = useUser();
  return <div>Welcome, {loading ? "???" : user?.name}</div>;
}
