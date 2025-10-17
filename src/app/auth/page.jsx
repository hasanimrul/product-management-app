"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Loader2, AlertCircle } from "lucide-react";
import useAuth from "@/hooks/use-auth";

export default function AuthPage() {
  const { email, setEmail, error, isLoading, handleSubmit } = useAuth();
  return (
    <div className="min-h-lvh flex items-center justify-center p-4 bg-gradient-to-br from-primary via-sage to-primary">
      <Card className="w-full max-w-md border-sage/30 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-sage rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-light" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-dark">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-dark/70 mt-2">
              Enter your email to access the Product Management System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-rust bg-rust/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-dark">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-sage hover:bg-sage/90 text-light font-semibold cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-dark/60">
            <p>Use this email: mohammadhasan.imrul@gmail.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
