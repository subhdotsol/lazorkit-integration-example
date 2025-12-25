"use client";

/**
 * LazorKit Passkey Wallet - Main Page
 * 
 * Split layout (NO BORDER between sections):
 * - LEFT: Integration guide with code examples
 * - RIGHT: Bigger phone mockup with wallet interface
 */

import { useState } from "react";
import { useLazor } from "@/hooks/useLazor";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Logo } from "@/components/ui/Logo";
import { ConnectScreen } from "@/components/wallet/ConnectScreen";
import { WalletCard } from "@/components/wallet/WalletCard";
import { TokenList } from "@/components/wallet/TokenList";
import { SendModal } from "@/components/wallet/SendModal";
import { ReceiveModal } from "@/components/wallet/ReceiveModal";
import { IntegrationGuide } from "@/components/IntegrationGuide";
import { IoWallet, IoSwapHorizontal, IoTime, IoSettings, IoLogOut } from "react-icons/io5";

export default function Home() {
  const { isConnected, disconnect } = useLazor();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);

  return (
    <div
      className="h-screen flex overflow-hidden transition-colors duration-300"
      style={{ background: isDark ? "#09090b" : "#f5f5f5" }}
    >
      {/* LEFT SIDE - Integration Guide (NO BORDER) */}
      <div className="flex-1 h-screen overflow-hidden">
        <IntegrationGuide />
      </div>

      {/* RIGHT SIDE - BIGGER Phone Mockup */}
      <div className="w-[520px] h-screen flex items-center justify-center shrink-0">
        <div className="relative">
          <PhoneFrame>
            {(!isConnected && !hasConnected) ? (
              <ConnectScreen onConnected={() => setHasConnected(true)} />
            ) : (
              <WalletContent
                onSend={() => setShowSend(true)}
                onReceive={() => setShowReceive(true)}
                onDisconnect={disconnect}
                showSend={showSend}
                showReceive={showReceive}
                onCloseSend={() => setShowSend(false)}
                onCloseReceive={() => setShowReceive(false)}
              />
            )}
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}

interface WalletContentProps {
  onSend: () => void;
  onReceive: () => void;
  onDisconnect: () => void;
  showSend: boolean;
  showReceive: boolean;
  onCloseSend: () => void;
  onCloseReceive: () => void;
}

function WalletContent({ onSend, onReceive, onDisconnect, showSend, showReceive, onCloseSend, onCloseReceive }: WalletContentProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="h-full flex flex-col transition-colors duration-300 relative"
      style={{ background: isDark ? "#0c0c0e" : "#ffffff" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 transition-colors"
        style={{ borderBottom: isDark ? "1px solid #27272a" : "1px solid #e5e5e5" }}
      >
        <Logo size="sm" />
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
          style={{
            color: isDark ? "#a1a1aa" : "#525252",
            background: isDark ? "#27272a" : "#f5f5f5",
            border: isDark ? "none" : "1px solid #e5e5e5",
            fontWeight: isDark ? 500 : 600,
          }}
        >
          <IoLogOut size={12} color={isDark ? "#a1a1aa" : "#525252"} />
          Exit
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Wallet Card */}
        <div className="p-4">
          <div
            className="rounded-2xl p-5 transition-colors"
            style={{
              background: isDark ? "#18181b" : "#fafafa",
              border: isDark ? "1px solid #27272a" : "1px solid #e5e5e5",
            }}
          >
            <WalletCard
              onSend={onSend}
              onReceive={onReceive}
            />
          </div>
        </div>

        {/* Token List */}
        <div className="px-4 pb-20">
          <div
            className="rounded-2xl p-5 transition-colors"
            style={{
              background: isDark ? "#18181b" : "#fafafa",
              border: isDark ? "1px solid #27272a" : "1px solid #e5e5e5",
            }}
          >
            <TokenList />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className="absolute bottom-0 left-0 right-0 px-4 py-2 pb-6 transition-colors"
        style={{
          background: isDark ? "#18181b" : "#ffffff",
          borderTop: isDark ? "1px solid #27272a" : "1px solid #e5e5e5",
        }}
      >
        <div className="flex justify-around">
          <NavButton icon={<IoWallet size={20} />} label="Wallet" active isDark={isDark} />
          <NavButton icon={<IoSwapHorizontal size={20} />} label="Swap" isDark={isDark} />
          <NavButton icon={<IoTime size={20} />} label="History" isDark={isDark} />
          <NavButton icon={<IoSettings size={20} />} label="Settings" isDark={isDark} />
        </div>
      </nav>

      {/* Modals INSIDE the phone */}
      {showSend && <SendModalInPhone onClose={onCloseSend} />}
      {showReceive && <ReceiveModalInPhone onClose={onCloseReceive} />}
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isDark: boolean;
}

function NavButton({ icon, label, active, isDark }: NavButtonProps) {
  return (
    <button
      className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
      style={{
        color: active ? (isDark ? "#ffffff" : "#000000") : (isDark ? "#71717a" : "#a1a1aa"),
        fontWeight: active ? 600 : 500,
      }}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}

// Send Modal that appears INSIDE the phone with TOKEN SELECTION
function SendModalInPhone({ onClose }: { onClose: () => void }) {
  const { sendSol, tokens, isSigning } = useLazor();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [signature, setSignature] = useState("");

  const selectedToken = tokens[selectedTokenIndex] || tokens[0];
  const amountNum = parseFloat(amount) || 0;
  const price = selectedToken ? (selectedToken.usdValue / selectedToken.balance) : 0;

  const handleSend = async () => {
    try {
      const sig = await sendSol(recipient, amountNum);
      setSignature(sig);
      setStatus("success");
    } catch { }
  };

  const bgColor = isDark ? "#18181b" : "#ffffff";
  const borderColor = isDark ? "#27272a" : "#e5e5e5";
  const textColor = isDark ? "#ffffff" : "#000000";
  const mutedColor = isDark ? "#71717a" : "#737373";

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: bgColor }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <button onClick={onClose} style={{ color: mutedColor, fontWeight: 500 }}>Cancel</button>
        <span style={{ color: textColor, fontWeight: 600 }}>Send</span>
        <div className="w-12" />
      </div>

      {status === "success" ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <p className="text-xl font-semibold mb-2" style={{ color: textColor }}>Sent!</p>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            className="text-sm mb-6"
            style={{ color: "#8b5cf6" }}
          >
            View on Explorer →
          </a>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
          >
            Done
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {/* Token Selector */}
          <button
            onClick={() => setShowTokenPicker(!showTokenPicker)}
            className="flex items-center gap-3 w-full p-3 rounded-xl mb-4"
            style={{ background: isDark ? "#27272a" : "#f5f5f5", border: `1px solid ${borderColor}` }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs">
              ◎
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium" style={{ color: textColor }}>{selectedToken?.symbol || "SOL"}</p>
              <p className="text-xs" style={{ color: mutedColor }}>{selectedToken?.balance.toFixed(4) || 0} available</p>
            </div>
            <span style={{ color: mutedColor }}>▼</span>
          </button>

          {/* Token Picker Dropdown */}
          {showTokenPicker && tokens.length > 0 && (
            <div className="mb-4 rounded-xl overflow-hidden" style={{ background: isDark ? "#27272a" : "#f5f5f5", border: `1px solid ${borderColor}` }}>
              {tokens.map((token, idx) => (
                <button
                  key={token.mint}
                  onClick={() => { setSelectedTokenIndex(idx); setShowTokenPicker(false); setAmount(""); }}
                  className="flex items-center gap-3 w-full p-3 text-left transition-colors"
                  style={{ background: selectedTokenIndex === idx ? (isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.1)") : "transparent" }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px]">◎</div>
                  <span className="text-sm" style={{ color: textColor }}>{token.symbol}</span>
                  <span className="text-xs ml-auto" style={{ color: mutedColor }}>{token.balance.toFixed(4)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Amount */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                className="bg-transparent text-4xl font-bold text-center outline-none w-28"
                style={{ color: textColor }}
              />
              <span className="text-xl font-bold" style={{ color: mutedColor }}>{selectedToken?.symbol || "SOL"}</span>
            </div>
            <p className="text-sm" style={{ color: mutedColor }}>≈ ${(amountNum * price).toFixed(2)}</p>
            <button
              onClick={() => setAmount((selectedToken?.balance - 0.001).toFixed(4))}
              className="text-xs px-3 py-1 mt-1 rounded-full"
              style={{ color: "#8b5cf6", background: isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.1)" }}
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
            className="w-full p-3 rounded-xl text-sm font-mono outline-none mb-4"
            style={{
              background: isDark ? "#27272a" : "#f5f5f5",
              border: `1px solid ${borderColor}`,
              color: textColor,
            }}
          />

          <div className="flex-1" />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSigning || !recipient || !amount || amountNum <= 0}
            className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
          >
            {isSigning ? "Confirming..." : "Send"}
          </button>
          <p className="text-center text-xs mt-2" style={{ color: mutedColor }}>⚡ Gasless • No fees</p>
        </div>
      )}
    </div>
  );
}

// Receive Modal that appears INSIDE the phone
function ReceiveModalInPhone({ onClose }: { onClose: () => void }) {
  const { address } = useLazor();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);

  const bgColor = isDark ? "#18181b" : "#ffffff";
  const borderColor = isDark ? "#27272a" : "#e5e5e5";
  const textColor = isDark ? "#ffffff" : "#000000";
  const mutedColor = isDark ? "#71717a" : "#737373";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: bgColor }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <button onClick={onClose} style={{ color: mutedColor, fontWeight: 500 }}>Close</button>
        <span style={{ color: textColor, fontWeight: 600 }}>Receive</span>
        <div className="w-12" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* QR Placeholder */}
        <div
          className="w-40 h-40 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: isDark ? "#27272a" : "#f5f5f5", border: `1px solid ${borderColor}` }}
        >
          <span className="text-5xl">📱</span>
        </div>

        <p className="text-sm mb-2" style={{ color: mutedColor }}>Your address</p>
        <p
          className="text-xs font-mono text-center mb-4 px-4 py-2 rounded-xl break-all"
          style={{ background: isDark ? "#27272a" : "#f5f5f5", color: textColor }}
        >
          {address}
        </p>

        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl font-semibold"
          style={{
            background: isDark ? "#27272a" : "#f5f5f5",
            color: textColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          {copied ? "Copied! ✓" : "Copy Address"}
        </button>

        <a
          href="https://faucet.solana.com"
          target="_blank"
          className="text-sm mt-4"
          style={{ color: "#8b5cf6" }}
        >
          Get test SOL →
        </a>
      </div>
    </div>
  );
}
