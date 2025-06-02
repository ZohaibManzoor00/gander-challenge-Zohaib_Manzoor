"use client";

import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { user, logout } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Charter Operations</h1>
          <span
            className={cn(
              "text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full",
              user &&
                (user?.role == "admin"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700")
            )}
          >
            {user ? <h3>{user.role === "admin" ? "Admin" : "Crew"}</h3> : "???"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <UserIcon className="h-4 w-4" />
            {user ? <h3>{user?.name}</h3> : "???"}
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
