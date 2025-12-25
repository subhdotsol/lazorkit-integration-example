"use client";

/**
 * LazorKit Logo Component
 * 
 * A beautiful gradient logo with the app name
 * Black in light mode, white/gradient in dark mode
 */

import { useTheme } from "@/components/providers/ThemeProvider";
import { HiLightningBolt } from "react-icons/hi";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showName?: boolean;
}

export function Logo({ size = "md", showName = true }: LogoProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const sizes = {
        sm: { icon: "w-7 h-7", iconSize: 14, text: "text-sm" },
        md: { icon: "w-8 h-8", iconSize: 16, text: "text-base" },
        lg: { icon: "w-14 h-14", iconSize: 28, text: "text-2xl" },
    };

    const s = sizes[size];

    return (
        <div className="flex items-center gap-2">
            <div
                className={`${s.icon} rounded-xl flex items-center justify-center shadow-lg`}
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                        : '#000000',
                    boxShadow: isDark ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
            >
                <HiLightningBolt size={s.iconSize} color="white" />
            </div>
            {showName && (
                <span
                    className={`font-semibold ${s.text}`}
                    style={{
                        color: isDark ? 'transparent' : '#000000',
                        background: isDark ? 'linear-gradient(135deg, #ab9ff2, #a78bfa, #c4b5fd)' : 'none',
                        WebkitBackgroundClip: isDark ? 'text' : 'unset',
                        backgroundClip: isDark ? 'text' : 'unset',
                    }}
                >
                    LazorKit
                </span>
            )}
        </div>
    );
}
