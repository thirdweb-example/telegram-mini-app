"use client";

import { useQuery } from "@tanstack/react-query";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { useRouter } from "next/navigation";
import { client } from "../../client";
import { Loader2 } from "lucide-react";


export default function TelegramLogin({ searchParams }: { searchParams: { signature: string, message: string } }) {
    const { connect } = useConnect();
    const router = useRouter();

    // This will connect to our wallet automatically on success, so we don't need to worry about the return data
    useQuery({
        queryKey: ["telegram-login"],
        queryFn: async () => {
            await connect(async () => {
                const wallet = inAppWallet({
                    smartAccount: {
                        sponsorGas: true,
                        chain: sepolia
                    }
                });
                await wallet.connect({
                    client,
                    strategy: "auth_endpoint",
                    payload: JSON.stringify({
                        signature: searchParams.signature,
                        message: searchParams.message,
                    }),
                    encryptionKey: process.env.NEXT_PUBLIC_AUTH_PHRASE as string,
                });
                return wallet;
            });
            
            router.replace("/");
            return true;
        },
    });

    return (
        <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
            Generating wallet...
        </div>
    )
}