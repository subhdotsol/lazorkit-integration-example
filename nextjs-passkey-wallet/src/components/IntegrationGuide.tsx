"use client";

/**
 * Integration Guide Component
 * 
 * Tab navigation with Next.js and Expo code examples
 * Uses react-syntax-highlighter for proper syntax highlighting
 */

import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { IoCopy, IoCheckmark, IoSunny, IoMoon } from "react-icons/io5";
import { SiNextdotjs, SiExpo } from "react-icons/si";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

type Tab = "nextjs" | "expo";

export function IntegrationGuide() {
    const { theme, toggleTheme, mounted } = useTheme();
    const isDark = theme === "dark";
    const [activeTab, setActiveTab] = useState<Tab>("nextjs");
    const [copied, setCopied] = useState(false);

    const bgColor = isDark ? "#09090b" : "#ffffff";
    const cardBg = isDark ? "#18181b" : "#f8f8f8";
    const borderColor = isDark ? "#27272a" : "#e5e5e5";
    const textColor = isDark ? "#fafafa" : "#0a0a0a";
    const mutedColor = isDark ? "#a1a1aa" : "#525252";

    const handleCopy = () => {
        const code = activeTab === "nextjs" ? nextJsCode : expoCode;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="h-full flex items-center justify-center" style={{ background: "#09090b" }}>
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div
            className="h-full flex flex-col overflow-hidden px-8 py-6"
            style={{ background: bgColor }}
        >
            {/* Header with Theme Toggle */}
            <div className="shrink-0 flex items-center justify-between mb-6">
                <div>
                    <h1
                        className="text-3xl mb-1"
                        style={{ color: textColor, fontWeight: isDark ? 600 : 700 }}
                    >
                        Integration Guide
                    </h1>
                    <p style={{ color: mutedColor, fontWeight: isDark ? 400 : 500 }}>
                        Add passkey authentication in minutes
                    </p>
                </div>

                {/* Theme Toggle Button - Simple and Clean */}
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                        background: isDark ? "#27272a" : "#f5f5f5",
                        border: `1px solid ${borderColor}`,
                    }}
                    title={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                    {isDark ? (
                        <IoSunny size={20} color="#fbbf24" />
                    ) : (
                        <IoMoon size={20} color="#6366f1" />
                    )}
                </button>
            </div>

            {/* Tab Navigation */}
            <div
                className="shrink-0 flex gap-1 mb-4 p-1 rounded-xl w-fit"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}
            >
                <TabButton
                    icon={<SiNextdotjs size={16} />}
                    label="Next.js"
                    active={activeTab === "nextjs"}
                    onClick={() => setActiveTab("nextjs")}
                    isDark={isDark}
                />
                <TabButton
                    icon={<SiExpo size={16} />}
                    label="Expo"
                    active={activeTab === "expo"}
                    onClick={() => setActiveTab("expo")}
                    isDark={isDark}
                />
            </div>

            {/* Code Block with Syntax Highlighting */}
            <div
                className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col"
                style={{ border: `1px solid ${borderColor}` }}
            >
                {/* Code Header */}
                <div
                    className="shrink-0 flex items-center justify-between px-4 py-3"
                    style={{
                        background: isDark ? "#1e1e1e" : "#f0f0f0",
                        borderBottom: `1px solid ${borderColor}`
                    }}
                >
                    <span
                        className="text-sm font-mono"
                        style={{ color: mutedColor }}
                    >
                        {activeTab === "nextjs" ? "page.tsx" : "App.tsx"}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors hover:opacity-80"
                        style={{
                            background: isDark ? "#2d2d2d" : "#e0e0e0",
                            color: mutedColor,
                        }}
                    >
                        {copied ? <><IoCheckmark size={14} color="#22c55e" />Copied</> : <><IoCopy size={14} />Copy</>}
                    </button>
                </div>

                {/* Code Content with Syntax Highlighter */}
                <div className="flex-1 overflow-auto">
                    <SyntaxHighlighter
                        language="typescript"
                        style={isDark ? oneDark : oneLight}
                        customStyle={{
                            margin: 0,
                            padding: "1.25rem",
                            fontSize: "14px",
                            lineHeight: "1.75",
                            background: isDark ? "#0d0d0f" : "#fafafa",
                            minHeight: "100%",
                        }}
                        codeTagProps={{
                            style: {
                                background: "transparent",
                            }
                        }}
                        lineProps={{
                            style: {
                                background: "transparent",
                                display: "block",
                            }
                        }}
                        wrapLines
                        wrapLongLines
                    >
                        {activeTab === "nextjs" ? nextJsCode : expoCode}
                    </SyntaxHighlighter>
                </div>
            </div>

            {/* Quick Features */}
            <div className="shrink-0 grid grid-cols-4 gap-3 mt-4">
                <FeatureCard icon="🔑" title="Seedless" isDark={isDark} />
                <FeatureCard icon="⛽" title="Gasless" isDark={isDark} />
                <FeatureCard icon="🔒" title="Secure" isDark={isDark} />
                <FeatureCard icon="⚡" title="Fast" isDark={isDark} />
            </div>
        </div>
    );
}

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    isDark: boolean;
}

function TabButton({ icon, label, active, onClick, isDark }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
            style={{
                background: active ? (isDark ? "#27272a" : "#ffffff") : "transparent",
                color: active ? (isDark ? "#ffffff" : "#000000") : (isDark ? "#71717a" : "#737373"),
                fontWeight: active ? 600 : 500,
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
        >
            {icon}
            {label}
        </button>
    );
}

interface FeatureCardProps {
    icon: string;
    title: string;
    isDark: boolean;
}

function FeatureCard({ icon, title, isDark }: FeatureCardProps) {
    return (
        <div
            className="p-3 rounded-xl text-center transition-colors"
            style={{
                background: isDark ? "#18181b" : "#f8f8f8",
                border: `1px solid ${isDark ? "#27272a" : "#e5e5e5"}`,
            }}
        >
            <span className="text-xl">{icon}</span>
            <p
                className="text-xs mt-1"
                style={{
                    color: isDark ? "#fafafa" : "#0a0a0a",
                    fontWeight: isDark ? 500 : 600,
                }}
            >
                {title}
            </p>
        </div>
    );
}

const nextJsCode = `// Step 1: Install packages
// npm install @lazorkit/wallet @solana/web3.js

// Step 2: Create Provider
"use client";
import { LazorkitProvider } from "@lazorkit/wallet";

export function LazorkitClientProvider({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com",
      }}
    >
      {children}
    </LazorkitProvider>
  );
}

// Step 3: Wrap your app
// <LazorkitClientProvider>{children}</LazorkitClientProvider>

// Step 4: Use in your component
"use client";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function WalletButton() {
  const { 
    connect,
    disconnect,
    wallet,
    signAndSendTransaction,
    isConnecting,
  } = useWallet();

  const handleConnect = async () => {
    await connect();
    console.log("Connected!");
  };

  const handleSend = async (to, amount) => {
    const instruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(wallet.smartWallet),
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL,
    });

    const sig = await signAndSendTransaction({
      instructions: [instruction],
    });
    console.log("Sent:", sig);
  };

  return (
    <button onClick={wallet ? disconnect : handleConnect}>
      {isConnecting ? "..." : wallet ? "Connected" : "Connect"}
    </button>
  );
}`;

const expoCode = `// Expo/React Native - Coming Soon!

// Native passkey support:
// - iOS 16+
// - Android 14+

// Features coming:
// - Native biometric auth
// - Seamless passkey flow
// - Same gasless support

// Stay tuned for @lazorkit/wallet-expo!`;
