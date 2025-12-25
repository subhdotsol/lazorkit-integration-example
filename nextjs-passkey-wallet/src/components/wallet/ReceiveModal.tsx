"use client";

/**
 * Receive Modal Component
 * 
 * Shows the wallet address with QR code and copy functionality
 */

import { useLazor } from "@/hooks/useLazor";
import { useState } from "react";

interface ReceiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
    const { address } = useLazor();
    const [copied, setCopied] = useState(false);

    if (!isOpen || !address) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const truncatedAddress = `${address.slice(0, 8)}...${address.slice(-8)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Receive SOL</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* QR Code Placeholder */}
                <div className="mb-6 p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex items-center justify-center">
                    <div className="text-center text-zinc-900">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-xs">QR Code</p>
                    </div>
                </div>

                {/* Address Display */}
                <div className="mb-6">
                    <p className="text-center text-sm text-zinc-400 mb-2">Your Wallet Address</p>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                        <p className="text-center font-mono text-sm break-all text-zinc-300">
                            {address}
                        </p>
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${copied
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        }`}
                >
                    {copied ? (
                        <>
                            <span>✓</span>
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <span>📋</span>
                            <span>Copy Address</span>
                        </>
                    )}
                </button>

                {/* Airdrop Link */}
                <a
                    href={`https://faucet.solana.com?address=${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm text-purple-400 hover:text-purple-300 mt-4 transition-colors"
                >
                    Get Devnet SOL from Faucet →
                </a>
            </div>
        </div>
    );
}
