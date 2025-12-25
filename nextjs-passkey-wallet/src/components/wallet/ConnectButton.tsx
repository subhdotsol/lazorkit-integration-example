"use client";

/**
 * Connect Button Component
 * 
 * This component handles passkey-based wallet connection using LazorKit.
 * When clicked, it triggers the WebAuthn authentication flow through
 * the LazorKit portal, allowing users to sign in with Face ID, Touch ID,
 * or Windows Hello.
 * 
 * Features:
 * - Connect/disconnect functionality
 * - Loading state during authentication
 * - Displays truncated wallet address when connected
 */

import { useWallet } from "@lazorkit/wallet";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";

interface ConnectButtonProps {
    className?: string;
}

export function ConnectButton({ className = "" }: ConnectButtonProps) {
    const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

    /**
     * Handle wallet connection
     * Uses paymaster mode for gasless transactions
     */
    const handleConnect = async () => {
        try {
            await connect({ feeMode: "paymaster" });
        } catch (error) {
            console.error("Failed to connect:", error);
        }
    };

    /**
     * Handle wallet disconnection
     */
    const handleDisconnect = () => {
        disconnect();
    };

    // Show connected state with wallet address
    if (isConnected && wallet) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                {/* Wallet Address Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-gray-300">
                        {truncateAddress(wallet.smartWallet, 6)}
                    </span>
                </div>

                {/* Disconnect Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    // Show connect button
    return (
        <Button
            variant="primary"
            size="md"
            loading={isConnecting}
            onClick={handleConnect}
            className={className}
        >
            {isConnecting ? "Connecting..." : "Connect with Passkey"}
        </Button>
    );
}
