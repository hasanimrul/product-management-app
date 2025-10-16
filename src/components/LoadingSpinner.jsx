"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-sage mb-4" />
      <p className="text-dark/70">{text}</p>
    </div>
  );
}
