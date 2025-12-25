"use client";

/**
 * Send Modal Component - COMPACT SIZE
 * 
 * A smaller slide-up modal for sending tokens with:
 * - Token selection (SOL or other available tokens)
 * - Clean compact design
 * - Amount input with USD conversion
 * - Transaction status feedback
 */

import { useState, useEffect } from "react";
import { useLazor, TokenBalance } from "@/hooks/useLazor";
import { useTheme } from "@/components/providers/ThemeProvider";
import Image from "next/image";
import { IoChevronDown, IoSend, IoCheckmarkCircle } from "react-icons/io5";

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SendModal({ isOpen, onClose }: SendModalProps) {
    const { sendSol, tokens, isSigning } = useLazor();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
    const [showTokenPicker, setShowTokenPicker] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && tokens.length > 0 && !selectedToken) {
            setSelectedToken(tokens[0]);
        }
    }, [isOpen, tokens, selectedToken]);

    useEffect(() => {
        if (isOpen) {
            setStatus("idle");
            setError(null);
            setShowTokenPicker(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const amountNum = parseFloat(amount) || 0;
    const price = selectedToken ? (selectedToken.usdValue / selectedToken.balance) : 0;
    const usdValue = amountNum * price;

    const handleSend = async () => {
        if (!selectedToken) return;
        try {
            setStatus("idle");
            setError(null);
            if (selectedToken.symbol === "SOL") {
                const signature = await sendSol(recipient, amountNum);
                setTxSignature(signature);
                setStatus("success");
            } else {
                setError("Only SOL transfers supported");
                setStatus("error");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
            setStatus("error");
        }
    };

    const handleMax = () => {
        if (selectedToken) {
            const maxAmount = Math.max(0, selectedToken.balance - 0.001);
            setAmount(maxAmount.toFixed(4));
        }
    };

    const handleClose = () => {
        setRecipient("");
        setAmount("");
        setStatus("idle");
        setTxSignature(null);
        setError(null);
        setSelectedToken(null);
        onClose();
    };

    const bgColor = isDark ? "#18181b" : "#ffffff";
    const borderColor = isDark ? "#27272a" : "#000000";
    const textColor = isDark ? "#ffffff" : "#000000";
    const mutedColor = isDark ? "#71717a" : "#9b9b97";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
                onClick={handleClose}
            />

            {/* Modal - SMALLER SIZE */}
            <div
                className="relative w-full max-w-[340px] rounded-2xl animate-scaleIn overflow-hidden"
                style={{ background: bgColor, border: `2px solid ${borderColor}` }}
            >

                {status === "success" && txSignature ? (
                    <SuccessView signature={txSignature} onClose={handleClose} isDark={isDark} />
                ) : (
                    <>
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-4 py-3"
                            style={{ borderBottom: `1px solid ${borderColor}` }}
                        >
                            <button onClick={handleClose} className="text-sm" style={{ color: mutedColor }}>
                                Cancel
                            </button>
                            <h2 className="text-base font-semibold" style={{ color: textColor }}>Send</h2>
                            <div className="w-12" />
                        </div>

                        {/* Token Selector */}
                        <div className="p-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
                            <button
                                onClick={() => setShowTokenPicker(!showTokenPicker)}
                                className="flex items-center gap-2 w-full p-2 rounded-xl transition-colors"
                                style={{ background: isDark ? "#27272a" : "#f5f5f5" }}
                            >
                                {selectedToken && (
                                    <>
                                        <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background: isDark ? "#3f3f46" : "#e5e5e5" }}>
                                            {selectedToken.logoUrl ? (
                                                <Image src={selectedToken.logoUrl} alt={selectedToken.symbol} width={32} height={32} className="w-full h-full" />
                                            ) : (
                                                <span className="text-sm flex items-center justify-center h-full">◎</span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium" style={{ color: textColor }}>{selectedToken.symbol}</p>
                                            <p className="text-xs" style={{ color: mutedColor }}>{selectedToken.balance.toFixed(4)} available</p>
                                        </div>
                                        <IoChevronDown size={16} color={mutedColor} />
                                    </>
                                )}
                            </button>

                            {showTokenPicker && (
                                <div className="mt-2 rounded-xl overflow-hidden" style={{ background: isDark ? "#27272a" : "#f5f5f5" }}>
                                    {tokens.map((token) => (
                                        <button
                                            key={token.mint}
                                            onClick={() => { setSelectedToken(token); setShowTokenPicker(false); setAmount(""); }}
                                            className="flex items-center gap-2 w-full p-2 text-left transition-colors"
                                            style={{ background: selectedToken?.mint === token.mint ? (isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)") : "transparent" }}
                                        >
                                            <div className="w-6 h-6 rounded-full overflow-hidden" style={{ background: isDark ? "#3f3f46" : "#e5e5e5" }}>
                                                {token.logoUrl ? <Image src={token.logoUrl} alt={token.symbol} width={24} height={24} className="w-full h-full" /> : <span className="text-xs">◎</span>}
                                            </div>
                                            <span className="text-sm" style={{ color: textColor }}>{token.symbol}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div className="p-4">
                            <div className="text-center mb-4">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                        disabled={isSigning}
                                        className="bg-transparent text-4xl font-bold text-center outline-none max-w-[120px]"
                                        style={{ color: textColor, caretColor: '#8b5cf6' }}
                                    />
                                    <span className="text-4xl font-bold" style={{ color: mutedColor }}>{selectedToken?.symbol || 'SOL'}</span>
                                </div>
                                <p className="text-sm" style={{ color: mutedColor }}>≈ ${usdValue.toFixed(2)} USD</p>
                                <button
                                    onClick={handleMax}
                                    className="mt-1 px-2 py-0.5 text-xs font-medium rounded-full"
                                    style={{ color: '#8b5cf6', background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }}
                                >
                                    MAX
                                </button>
                            </div>

                            {/* Recipient */}
                            <input
                                type="text"
                                placeholder="Recipient address"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                disabled={isSigning}
                                className="w-full p-3 rounded-xl text-xs outline-none transition-colors font-mono mb-3"
                                style={{ background: isDark ? "#27272a" : "#f5f5f5", border: `1px solid ${borderColor}`, color: textColor }}
                            />

                            {error && (
                                <div className="mb-3 p-2 rounded-xl text-center text-xs" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSend}
                                disabled={isSigning || !recipient || !amount || amountNum <= 0}
                                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                            >
                                {isSigning ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Confirming...</>
                                ) : (
                                    <><IoSend size={14} />Send</>
                                )}
                            </button>

                            <p className="text-center text-[10px] mt-2" style={{ color: mutedColor }}>⚡ Gasless • No fees</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function SuccessView({ signature, onClose, isDark }: { signature: string; onClose: () => void; isDark: boolean }) {
    const textColor = isDark ? "#ffffff" : "#000000";
    const mutedColor = isDark ? "#71717a" : "#9b9b97";
    const bgColor = isDark ? "#27272a" : "#f5f5f5";

    return (
        <div className="p-6 text-center animate-scaleIn">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 border-4 border-green-500 rounded-full flex items-center justify-center">
                <IoCheckmarkCircle size={36} color="#22c55e" />
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: textColor }}>Sent!</h3>
            <p className="text-sm mb-4" style={{ color: mutedColor }}>Transaction confirmed</p>
            <a
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 mb-2 rounded-xl text-sm font-medium transition-colors"
                style={{ background: bgColor, color: textColor }}
            >
                View on Explorer →
            </a>
            <button
                onClick={onClose}
                className="w-full py-2 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
            >
                Done
            </button>
        </div>
    );
}
