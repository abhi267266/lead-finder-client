"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect root to dashboard. 
    // Dashboard layout handles the auth gate.
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-dark">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}
