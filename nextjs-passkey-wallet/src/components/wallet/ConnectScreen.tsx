"use client";

/**
 * Connect Screen Component
 * 
 * Beautiful landing screen with passkey connection animation
 * Designed to fit inside the phone frame
 */

import { useLazor } from "@/hooks/useLazor";
import { useState, useEffect } from "react";

interface ConnectScreenProps {
    onConnected: () => void;
}

export function ConnectScreen({ onConnected }: ConnectScreenProps) {
    const { connect, isConnecting, isConnected, error } = useLazor();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isConnected) {
            onConnected();
        }
    }, [isConnected, onConnected]);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (err) {
            console.error("Connection failed:", err);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[200px] h-[200px] bg-indigo-600/20 rounded-full blur-[60px]" />
            </div>

            {/* Content */}
            <div className={`relative z-10 text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Logo */}
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-bounce">
                        <span className="text-4xl">🔐</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-2 tracking-tight">
                    <span className="gradient-text">LazorKit</span>
                </h1>
                <p className="text-lg text-zinc-400 mb-2">
                    Passkey Wallet
                </p>
                <p className="text-sm text-zinc-500 mb-10 max-w-[250px] mx-auto leading-relaxed">
                    No seed phrases. No extensions.<br />Just your fingerprint.
                </p>

                {/* Connect Button */}
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-semibold text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <span className="relative flex items-center justify-center gap-3">
                        {isConnecting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <span className="text-xl">👆</span>
                                Connect with Passkey
                            </>
                        )}
                    </span>
                </button>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-fadeIn">
                        {error}
                    </div>
                )}

                {/* Features */}
                <div className="mt-12 grid grid-cols-3 gap-4">
                    <Feature icon="🔑" title="Seedless" delay={200} />
                    <Feature icon="⛽" title="Gasless" delay={300} />
                    <Feature icon="🔒" title="Secure" delay={400} />
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center">
                <p className="text-zinc-600 text-xs">
                    Powered by LazorKit SDK
                </p>
            </div>
        </div>
    );
}

interface FeatureProps {
    icon: string;
    title: string;
    delay: number;
}

function Feature({ icon, title, delay }: FeatureProps) {
    return (
        <div
            className="text-center animate-fadeIn opacity-0"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            <div className="w-10 h-10 mx-auto mb-1 bg-zinc-800/50 rounded-xl flex items-center justify-center text-xl">
                {icon}
            </div>
            <p className="text-[10px] text-zinc-500">{title}</p>
        </div>
    );
}
