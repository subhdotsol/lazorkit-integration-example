"use client";

/**
 * Wallet Card Component - SOLID FILL icons
 * 
 * All action buttons have solid filled backgrounds
 */

import { useLazor } from "@/hooks/useLazor";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
    IoWallet,
    IoArrowDown,
    IoCard,
    IoSwapHorizontal,
    IoLayers,
    IoSend,
    IoRefresh,
    IoCopy,
    IoCheckmark
} from "react-icons/io5";

interface WalletCardProps {
    onSend: () => void;
    onReceive: () => void;
}

export function WalletCard({ onSend, onReceive }: WalletCardProps) {
    const { totalUsdValue, address, refreshBalance, tokens } = useLazor();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);

    const priceChange = tokens[0]?.priceChange24h || 0;
    const isPositive = priceChange >= 0;
    const changeUsd = (totalUsdValue * (priceChange / 100));

    const handleRefresh = async () => {
        setIsRefreshing(true);
        refreshBalance();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const truncatedAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';
    const textColor = isDark ? "#ffffff" : "#0a0a0a";
    const mutedColor = isDark ? "#71717a" : "#737373";

    return (
        <div className="animate-fadeIn">
            {/* Wallet Selector */}
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 mx-auto mb-6 px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{
                    background: isDark ? "#27272a" : "#f5f5f5",
                    border: isDark ? "none" : "1px solid #e5e5e5",
                }}
            >
                <IoWallet size={16} color={isDark ? "#ffffff" : "#0a0a0a"} />
                <span className="text-sm" style={{ color: textColor, fontWeight: isDark ? 500 : 600 }}>{truncatedAddress}</span>
                {copied ? <IoCheckmark size={14} color="#22c55e" /> : <IoCopy size={14} color={mutedColor} />}
            </button>

            {/* Balance Display */}
            <div className="text-center mb-8">
                <p className="text-sm mb-1" style={{ color: mutedColor, fontWeight: isDark ? 400 : 500 }}>Balance</p>
                <h1
                    className="text-[52px] tracking-tight leading-none mb-1"
                    style={{ color: textColor, fontWeight: isDark ? 700 : 800 }}
                >
                    ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm">
                    <span style={{ color: isPositive ? "#22c55e" : "#ef4444", fontWeight: 500 }}>
                        {isPositive ? '+' : ''}${Math.abs(changeUsd).toFixed(2)} ({isPositive ? '+' : ''}{priceChange.toFixed(2)}%)
                    </span>
                    <button
                        onClick={handleRefresh}
                        className={`ml-1 transition-all hover:scale-110 ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <IoRefresh size={14} color={mutedColor} />
                    </button>
                </div>
            </div>

            {/* Action Buttons - ALL SOLID */}
            <div className="flex justify-center gap-3">
                <ActionButton
                    icon={<IoArrowDown size={22} />}
                    label="Receive"
                    onClick={onReceive}
                    isDark={isDark}
                    solid
                />
                <ActionButton
                    icon={<IoCard size={22} />}
                    label="Buy"
                    onClick={() => { }}
                    disabled
                    isDark={isDark}
                    solid
                />
                <ActionButton
                    icon={<IoSwapHorizontal size={22} />}
                    label="Swap"
                    onClick={() => { }}
                    disabled
                    isDark={isDark}
                    solid
                />
                <ActionButton
                    icon={<IoLayers size={22} />}
                    label="Stake"
                    onClick={() => { }}
                    disabled
                    isDark={isDark}
                    solid
                />
                <ActionButton
                    icon={<IoSend size={22} />}
                    label="Send"
                    onClick={onSend}
                    isDark={isDark}
                    highlight
                />
            </div>
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    highlight?: boolean;
    disabled?: boolean;
    isDark: boolean;
    solid?: boolean;
}

function ActionButton({ icon, label, onClick, highlight, disabled, isDark, solid }: ActionButtonProps) {
    // Solid filled backgrounds for all buttons
    let bgStyle = "";
    let iconColor = "";

    if (highlight) {
        bgStyle = "linear-gradient(135deg, #8b5cf6, #6366f1)";
        iconColor = "#ffffff";
    } else if (solid) {
        bgStyle = isDark ? "#ffffff" : "#0a0a0a";
        iconColor = isDark ? "#0a0a0a" : "#ffffff";
    } else {
        bgStyle = isDark ? "#27272a" : "#f5f5f5";
        iconColor = isDark ? "#ffffff" : "#0a0a0a";
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        flex flex-col items-center gap-2 transition-all duration-200
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
      `}
        >
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={{
                    background: bgStyle,
                    boxShadow: highlight ? '0 8px 24px rgba(139, 92, 246, 0.4)' : 'none',
                    color: iconColor,
                }}
            >
                {icon}
            </div>
            <span
                className="text-[11px]"
                style={{
                    color: isDark ? '#a1a1aa' : '#525252',
                    fontWeight: isDark ? 500 : 600,
                }}
            >
                {label}
            </span>
        </button>
    );
}
