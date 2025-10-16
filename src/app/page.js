"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // Check localStorage for persisted auth state
    if (typeof window !== "undefined") {
      const persistedState = localStorage.getItem("redux_state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.auth?.isAuthenticated) {
            router.replace("/products");
            return;
          }
        } catch (error) {
          console.error("Error parsing persisted state:", error);
        }
      }
    }

    if (isAuthenticated) {
      router.replace("/products");
    } else {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <LoadingSpinner text="Redirecting..." />
    </div>
  );
}
