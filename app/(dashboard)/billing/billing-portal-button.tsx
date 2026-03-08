"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function BillingPortalButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpenPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        if (res.status === 503 && data.error) {
          alert(data.error);
        }
        setLoading(false);
        router.refresh();
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleOpenPortal} disabled={loading} size="sm">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        "Manage billing"
      )}
    </Button>
  );
}
