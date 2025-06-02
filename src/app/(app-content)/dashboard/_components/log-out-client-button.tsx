"use client";

import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";

export function LogOutClientButton() {
  const { logout } = useUser();

  return <Button onClick={logout}>Logout</Button>;
}
