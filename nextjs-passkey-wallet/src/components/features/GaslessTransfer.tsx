"use client";

/**
 * Gasless Transfer Component
 * 
 * This component demonstrates how to execute gasless transactions on Solana
 * using LazorKit's Paymaster integration. Users can transfer SOL without
 * needing to hold SOL for gas fees - the Paymaster sponsors the transaction.
 * 
 * Key features:
 * - Gasless SOL transfers (fees paid by Paymaster)
 * - Option to pay fees in USDC instead of SOL
 * - Real-time transaction status feedback
 * - Explorer link for completed transactions
 */

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidSolanaAddress, getExplorerUrl } from "@/lib/utils";
import { TransactionStatus } from "@/types";

export function GaslessTransfer() {
    const { signAndSendTransaction, wallet, isConnected } = useWallet();

    // Form state
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [feeToken, setFeeToken] = useState<"SOL" | "USDC">("USDC");

    // Transaction state
    const [status, setStatus] = useState<TransactionStatus>("idle");
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Execute the gasless transfer
     */
    const handleTransfer = async () => {
        // Validate wallet connection
        if (!wallet?.smartWallet) {
            setError("Wallet not connected");
            return;
        }

        if (!isValidSolanaAddress(recipient)) {
            setError("Invalid recipient address");
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError("Invalid amount");
            return;
        }

        try {
            setStatus("pending");
            setError(null);
            setSignature(null);

            // Get the smart wallet public key
            const fromPubkey = new PublicKey(wallet.smartWallet);

            // Create the transfer instruction
            const instruction = SystemProgram.transfer({
                fromPubkey: fromPubkey,
                toPubkey: new PublicKey(recipient),
                lamports: Math.floor(amountNum * LAMPORTS_PER_SOL),
            });

            // Sign and send via Paymaster (gasless!)
            // SDK 2.0.1: Paymaster pays all fees - user signs with passkey only
            const txSignature = await signAndSendTransaction({
                instructions: [instruction],
                transactionOptions: {
                    computeUnitLimit: 200_000,
                },
            });

            setSignature(txSignature);
            setStatus("success");

            // Reset form
            setRecipient("");
            setAmount("");
        } catch (err) {
            console.error("Transfer failed:", err);
            const errorMessage = err instanceof Error ? err.message : "Transfer failed";
            setError(errorMessage);
            setStatus("error");
        }
    };


    if (!isConnected) {
        return (
            <Card title="Gasless Transfer" description="Send SOL without paying gas fees">
                <div className="text-center py-6 text-gray-500">
                    Connect your wallet to send transactions
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Gasless Transfer"
            description="Send SOL without paying gas fees - powered by Paymaster"
        >
            <div className="space-y-4">
                {/* Recipient Input */}
                <Input
                    label="Recipient Address"
                    placeholder="Enter Solana address..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={status === "pending"}
                />

                {/* Amount Input */}
                <Input
                    label="Amount (SOL)"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === "pending"}
                />

                {/* Fee Token Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pay Fees With
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFeeToken("USDC")}
                            className={`flex-1 py-2 px-4 rounded-xl border transition-all ${feeToken === "USDC"
                                ? "border-violet-500 bg-violet-500/20 text-violet-300"
                                : "border-gray-700 text-gray-400 hover:border-gray-600"
                                }`}
                            disabled={status === "pending"}
                        >
                            USDC (Gasless)
                        </button>
                        <button
                            type="button"
                            onClick={() => setFeeToken("SOL")}
                            className={`flex-1 py-2 px-4 rounded-xl border transition-all ${feeToken === "SOL"
                                ? "border-violet-500 bg-violet-500/20 text-violet-300"
                                : "border-gray-700 text-gray-400 hover:border-gray-600"
                                }`}
                            disabled={status === "pending"}
                        >
                            SOL
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {status === "success" && signature && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <p className="text-green-400 text-sm mb-2">
                            ✓ Transfer successful!
                        </p>
                        <a
                            href={getExplorerUrl(signature)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-violet-400 hover:text-violet-300 underline"
                        >
                            View on Solana Explorer →
                        </a>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    variant="primary"
                    className="w-full"
                    loading={status === "pending"}
                    onClick={handleTransfer}
                    disabled={!recipient || !amount || status === "pending"}
                >
                    {status === "pending" ? "Sending..." : "Send SOL"}
                </Button>

                {/* Info Note */}
                <p className="text-xs text-gray-500 text-center">
                    💡 Gas fees are sponsored by LazorKit Paymaster on Devnet
                </p>
            </div>
        </Card>
    );
}
