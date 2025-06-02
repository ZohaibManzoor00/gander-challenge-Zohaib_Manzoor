"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaneTakeoff, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const demoAccounts = [
  {
    email: "admin@charterops.com",
    password: "admin123",
    name: "Charter Operations Manager",
    role: "admin",
  },
  {
    email: "dispatch@charterops.com",
    password: "dispatch123",
    name: "Flight Dispatcher",
    role: "admin",
  },
  {
    email: "john.smith@charterops.com",
    password: "pilot123",
    name: "John Smith",
    role: "crew",
  },
  {
    email: "sarah.johnson@charterops.com",
    password: "pilot123",
    name: "Sarah Johnson",
    role: "crew",
  },
  {
    email: "michael.brown@charterops.com",
    password: "crew123",
    name: "Michael Brown",
    role: "crew",
  },
  {
    email: "emily.davis@charterops.com",
    password: "pilot123",
    name: "Emily Davis",
    role: "crew",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const user = await res.json();

      if (!res.ok) {
        setError(user.error || "Login failed");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }

    setLoading(false);
  };

  const handleDemoLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200 p-6 h-full">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <PlaneTakeoff className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Flight Scheduler
            </CardTitle>
            <CardDescription>
              Part 135 Charter Operations Management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="border-gray-300 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-gray-200 p-6 h-full">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Click to auto-fill login credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                Charter Admin Accounts:
              </h4>
              <div className="space-y-2">
                {demoAccounts
                  .filter((user) => user.role === "admin")
                  .map((user, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer w-full justify-start text-left py-6"
                      onClick={() => handleDemoLogin(user.email, user.password)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                Crew/Pilot Accounts:
              </h4>
              <div className="space-y-2">
                {demoAccounts
                  .filter((user) => user.role === "crew")
                  .map((user, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left py-6"
                      onClick={() => handleDemoLogin(user.email, user.password)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
