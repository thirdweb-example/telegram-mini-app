"use client";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThirdwebProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThirdwebProvider>
    );
}