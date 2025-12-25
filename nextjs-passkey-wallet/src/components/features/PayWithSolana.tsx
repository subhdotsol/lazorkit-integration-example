"use client";

/**
 * Pay With Solana Widget
 * 
 * A reusable payment widget component that can be embedded in any page
 * to accept SOL or USDC payments. This demonstrates how merchants can
 * integrate LazorKit for seamless crypto payments.
 * 
 * Features:
 * - Configurable amount and currency
 * - Passkey authentication for payment
 * - Gasless transactions via Paymaster
 * - Success/error callbacks
 */

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/Button";
import { getExplorerUrl, truncateAddress } from "@/lib/utils";
import { TransactionStatus, PaymentWidgetProps } from "@/types";

export function PayWithSolana({
    recipient,
    amount,
    currency = "SOL",
    onSuccess,
    onError,
    className = "",
}: PaymentWidgetProps) {
    const { connect, signAndSendTransaction, smartWalletPubkey, isConnected, isConnecting } = useWallet();

    const [status, setStatus] = useState<TransactionStatus>("idle");
    const [signature, setSignature] = useState<string | null>(null);

    /**
     * Handle the complete payment flow
     */
    const handlePayment = async () => {
        try {
            // Step 1: Connect if not connected
            if (!isConnected) {
                await connect({ feeMode: "paymaster" });
            }

            // Wait for wallet to be available
            if (!smartWalletPubkey) {
                throw new Error("Wallet connection failed");
            }

            setStatus("pending");

            // Step 2: Create payment instruction
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey(recipient),
                lamports: Math.floor(amount * LAMPORTS_PER_SOL),
            });

            // Step 3: Execute gasless payment
            const txSignature = await signAndSendTransaction({
                instructions: [instruction],
                transactionOptions: {
                    feeToken: currency === "USDC" ? "USDC" : "SOL",
                },
            });

            setSignature(txSignature);
            setStatus("success");
            onSuccess?.(txSignature);
        } catch (err) {
            console.error("Payment failed:", err);
            setStatus("error");
            onError?.(err instanceof Error ? err : new Error("Payment failed"));
        }
    };

    return (
        <div
            className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <svg
                    className="w-6 h-6 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="text-lg font-semibold text-white">Pay with Solana</span>
            </div>

            {/* Amount Display */}
            <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-1">
                    {amount} {currency}
                </div>
                <div className="text-sm text-gray-400">
                    To: {truncateAddress(recipient, 6)}
                </div>
            </div>

            {/* Status Messages */}
            {status === "success" && signature && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                    <p className="text-green-400 text-sm mb-2">✓ Payment successful!</p>
                    <a
                        href={getExplorerUrl(signature)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-violet-400 hover:text-violet-300"
                    >
                        View transaction →
                    </a>
                </div>
            )}

            {status === "error" && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                    <p className="text-red-400 text-sm">Payment failed. Please try again.</p>
                </div>
            )}

            {/* Pay Button */}
            {status !== "success" && (
                <Button
                    variant="primary"
                    className="w-full"
                    loading={status === "pending" || isConnecting}
                    onClick={handlePayment}
                >
                    {status === "pending"
                        ? "Processing..."
                        : isConnecting
                            ? "Connecting..."
                            : isConnected
                                ? `Pay ${amount} ${currency}`
                                : "Connect & Pay"}
                </Button>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
                <span>Secured by LazorKit Passkeys</span>
            </div>
        </div>
    );
}
