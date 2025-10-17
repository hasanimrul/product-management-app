"use client";

import { Loader } from "lucide-react";

export default function LoadingSpinner({ text }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <Loader className="h-8 w-8 animate-spin text-sage" />
      <p className="text-dark/70">{text}</p>
    </div>
  );
}
