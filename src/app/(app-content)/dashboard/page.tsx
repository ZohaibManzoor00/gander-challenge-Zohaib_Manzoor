"use client";

import { redirect } from "next/navigation";
import { useUser } from "../../../hooks/use-user";

import { AdminDashboard } from "./_components/admin-dashboard";
import { CrewDashboard } from "./_components/crew-dashboard";
import { Navbar } from "./_components/navbar";

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) return null;
  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl p-6">
        {user.role === "admin" ? <AdminDashboard /> : <CrewDashboard />}
      </main>
      <div className="h-12" />
    </div>
  );
}
