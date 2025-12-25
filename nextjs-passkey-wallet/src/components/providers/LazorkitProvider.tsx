"use client";

/**
 * LazorKit Provider Wrapper
 * 
 * This component wraps your application with the LazorkitProvider
 * to enable passkey-based wallet authentication throughout your app.
 * 
 * Configuration:
 * - rpcUrl: Solana RPC endpoint (devnet/mainnet)
 * - portalUrl: LazorKit authentication portal
 * - paymasterConfig: Enables gasless transactions
 */

import { ReactNode } from "react";
import { LazorkitProvider as Provider } from "@lazorkit/wallet";
import { RPC_URL, PORTAL_URL, PAYMASTER_CONFIG } from "@/lib/constants";

// Polyfill Buffer for Next.js (required for Solana libraries)
if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    window.Buffer = window.Buffer || require("buffer").Buffer;
}

interface LazorkitProviderProps {
    children: ReactNode;
}

export function LazorkitClientProvider({ children }: LazorkitProviderProps) {
    return (
        <Provider
            rpcUrl={RPC_URL}
            portalUrl={PORTAL_URL}
            paymasterConfig={PAYMASTER_CONFIG}
        >
            {children}
        </Provider>
    );
}
