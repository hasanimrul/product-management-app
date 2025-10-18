"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ error, onRetry }) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="border-rust bg-rust/10">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between ">
        <span>{error}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
