"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnityPage() {
  const router = useRouter();

  useEffect(() => {
    const container = document.createElement("div");
    container.id = "unity-container";
    document.body.appendChild(container);

    const iframe = document.createElement("iframe");
    iframe.src = "/unity-webgl/index.html" + window.location.search;
    iframe.style.border = "none";
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    container.appendChild(iframe);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return null; // No UI for this page
}
