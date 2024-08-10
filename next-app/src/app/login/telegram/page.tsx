"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TelegramLogin({
  searchParams,
}: {
  searchParams: { signature: string; message: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const payload = JSON.stringify({
      signature: searchParams.signature,
      message: searchParams.message,
    });
    router.push(`/unity?payload=${encodeURIComponent(payload)}`);
  }, [searchParams.signature, searchParams.message, router]);

  return null; // No UI for this page
}
