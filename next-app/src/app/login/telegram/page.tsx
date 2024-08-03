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

    // Store the payload server-side
    fetch("/api/storePayload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Payload stored on the server:", data);
        // Redirect to the Unity page with the username
        router.push(`/unity?username=${data.username}`);
      })
      .catch((error) => console.error("Error storing payload:", error));
  }, [searchParams.signature, searchParams.message, router]);

  return null; // No UI for this page
}
