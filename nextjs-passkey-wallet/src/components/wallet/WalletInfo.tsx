"use client";

/**
 * Wallet Info Component
 * 
 * Displays detailed information about the connected LazorKit smart wallet
 * including the wallet address and a link to view it on Solana Explorer.
 */

import { useWallet } from "@lazorkit/wallet";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { truncateAddress, getAccountExplorerUrl } from "@/lib/utils";

export function WalletInfo() {
    const { isConnected, wallet } = useWallet();

    if (!isConnected || !wallet) {
        return (
            <Card className="text-center">
                <div className="py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                        No Wallet Connected
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Connect with your passkey to get started
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Smart Wallet"
            description="Your LazorKit passkey-controlled wallet"
        >
            <div className="space-y-4">
                {/* Wallet Address */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Wallet Address
                        </p>
                        <p className="font-mono text-white">
                            {truncateAddress(wallet.smartWallet, 8)}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(wallet.smartWallet)}
                        title="Copy address"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </Button>
                </div>

                {/* Credential ID */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Credential ID
                    </p>
                    <p className="font-mono text-gray-400 text-sm truncate">
                        {wallet.credentialId}
                    </p>
                </div>

                {/* View on Explorer */}
                <a
                    href={getAccountExplorerUrl(wallet.smartWallet)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                    View on Solana Explorer
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            </div>
        </Card>
    );
}
