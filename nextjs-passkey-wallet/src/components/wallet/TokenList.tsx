"use client";

/**
 * Token List Component
 * 
 * Displays the user's real token holdings with:
 * - Token logo from Solana token registry
 * - Balance and REAL-TIME USD value
 * - Transaction history tab
 * - Proper black/white icons based on theme
 */

import { useLazor, TokenBalance, Transaction } from "@/hooks/useLazor";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState } from "react";
import Image from "next/image";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";

export function TokenList() {
    const { tokens, transactions, totalUsdValue, solPrice } = useLazor();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [activeTab, setActiveTab] = useState<"tokens" | "activity">("tokens");

    return (
        <div className="animate-slideUp">
            {/* Tabs */}
            <div
                className="flex gap-6 mb-4 pb-3"
                style={{ borderBottom: isDark ? "1px solid #27272a" : "1px solid #e5e5e5" }}
            >
                <TabButton
                    label="Tokens"
                    active={activeTab === "tokens"}
                    onClick={() => setActiveTab("tokens")}
                    isDark={isDark}
                />
                <TabButton
                    label="Activity"
                    active={activeTab === "activity"}
                    onClick={() => setActiveTab("activity")}
                    badge={transactions.length > 0 ? transactions.length : undefined}
                    isDark={isDark}
                />
            </div>

            {/* Total Value */}
            <div className="mb-4">
                <p style={{ color: isDark ? "#71717a" : "#9b9b97" }} className="text-xs uppercase tracking-wide">
                    Total Value
                </p>
                <p style={{ color: isDark ? "#ffffff" : "#37352f" }} className="text-2xl font-semibold">
                    ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {solPrice > 0 && (
                    <p style={{ color: isDark ? "#71717a" : "#9b9b97" }} className="text-xs mt-0.5">
                        SOL: ${solPrice.toFixed(2)} (live)
                    </p>
                )}
            </div>

            {/* Content */}
            {activeTab === "tokens" ? (
                <TokensTab tokens={tokens} isDark={isDark} />
            ) : (
                <ActivityTab transactions={transactions} isDark={isDark} />
            )}
        </div>
    );
}

interface TabButtonProps {
    label: string;
    active?: boolean;
    onClick: () => void;
    badge?: number;
    isDark: boolean;
}

function TabButton({ label, active, onClick, badge, isDark }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className="text-sm font-medium transition-all relative pb-1"
            style={{
                color: active
                    ? (isDark ? "#ffffff" : "#37352f")
                    : (isDark ? "#71717a" : "#9b9b97"),
                borderBottom: active ? "2px solid #8b5cf6" : "2px solid transparent",
            }}
        >
            {label}
            {badge && (
                <span
                    className="absolute -top-1 -right-4 w-5 h-5 rounded-full text-[10px] flex items-center justify-center text-white"
                    style={{ background: "#8b5cf6" }}
                >
                    {badge}
                </span>
            )}
        </button>
    );
}

function TokensTab({ tokens, isDark }: { tokens: TokenBalance[], isDark: boolean }) {
    return (
        <div className="space-y-1">
            {tokens.map((token, index) => (
                <TokenRow key={token.mint} token={token} delay={index * 100} isDark={isDark} />
            ))}

            {tokens.length === 0 && (
                <div className="text-center py-8" style={{ color: isDark ? "#71717a" : "#9b9b97" }}>
                    <p className="text-3xl mb-2">💰</p>
                    <p>No tokens found</p>
                    <p className="text-sm mt-1">Airdrop some SOL to get started</p>
                </div>
            )}
        </div>
    );
}

function ActivityTab({ transactions, isDark }: { transactions: Transaction[], isDark: boolean }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-8" style={{ color: isDark ? "#71717a" : "#9b9b97" }}>
                <p className="text-3xl mb-2">📜</p>
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Send some SOL to see history</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {transactions.map((tx, index) => (
                <TransactionRow key={tx.signature} transaction={tx} delay={index * 50} isDark={isDark} />
            ))}
        </div>
    );
}

interface TokenRowProps {
    token: TokenBalance;
    delay: number;
    isDark: boolean;
}

function TokenRow({ token, delay, isDark }: TokenRowProps) {
    const isPositive = token.priceChange24h >= 0;
    const pricePerToken = token.balance > 0 ? token.usdValue / token.balance : 0;

    return (
        <div
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer animate-fadeIn transition-colors"
            style={{
                animationDelay: `${delay}ms`,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
            }}
        >
            {/* Left: Logo and Name */}
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ background: isDark ? "#27272a" : "#f0f0f0" }}
                >
                    {token.logoUrl ? (
                        <Image
                            src={token.logoUrl}
                            alt={token.symbol}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg font-bold">◎</span>
                    )}
                </div>
                <div>
                    <p style={{ color: isDark ? "#ffffff" : "#37352f" }} className="font-medium">{token.name}</p>
                    <p style={{ color: isDark ? "#71717a" : "#9b9b97" }} className="text-sm">
                        ${pricePerToken.toFixed(2)}
                        <span
                            className="ml-2"
                            style={{ color: isPositive ? "#22c55e" : "#ef4444" }}
                        >
                            {isPositive ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                        </span>
                    </p>
                </div>
            </div>

            {/* Right: USD Value and balance */}
            <div className="text-right">
                <p style={{ color: isDark ? "#ffffff" : "#37352f" }} className="font-medium">
                    ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p style={{ color: isDark ? "#71717a" : "#9b9b97" }} className="text-sm">
                    {token.balance.toFixed(4)} {token.symbol}
                </p>
            </div>
        </div>
    );
}

interface TransactionRowProps {
    transaction: Transaction;
    delay: number;
    isDark: boolean;
}

function TransactionRow({ transaction, delay, isDark }: TransactionRowProps) {
    const isSend = transaction.type === "send";
    const truncatedSig = `${transaction.signature.slice(0, 6)}...${transaction.signature.slice(-4)}`;
    const timeAgo = getTimeAgo(transaction.timestamp);

    return (
        <a
            href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl animate-fadeIn transition-colors"
            style={{ animationDelay: `${delay}ms` }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
            }}
        >
            {/* Left: Icon and Details */}
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                        background: isSend ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                    }}
                >
                    {isSend ? (
                        <HiArrowUp size={20} color="#ef4444" />
                    ) : (
                        <HiArrowDown size={20} color="#22c55e" />
                    )}
                </div>
                <div>
                    <p style={{ color: isDark ? "#ffffff" : "#37352f" }} className="font-medium">
                        {isSend ? 'Sent' : 'Received'}
                    </p>
                    <p style={{ color: isDark ? "#71717a" : "#9b9b97" }} className="text-sm">{truncatedSig}</p>
                </div>
            </div>

            {/* Right: Amount and Time */}
            <div className="text-right">
                <p className="font-medium" style={{ color: isSend ? '#ef4444' : '#22c55e' }}>
                    {isSend ? '-' : '+'}{transaction.amount.toFixed(4)} SOL
                </p>
                <p style={{ color: isDark ? "#71717a" : "#9b9b97" }} className="text-sm">{timeAgo}</p>
            </div>
        </a>
    );
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
