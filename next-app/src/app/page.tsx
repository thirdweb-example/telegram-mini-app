"use client";
import { useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { AutoConnect } from "thirdweb/react";
import MiniGame from "./components/MiniGame";


export default function Home() {
  const account = useActiveAccount();

  return (
    <main className="h-screen w-full">
      <AutoConnect client={client} />
      {account && (
        <MiniGame />
      )}
    </main>
  );
}

