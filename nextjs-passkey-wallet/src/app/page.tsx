"use client";

/**
 * LazorKit Passkey Wallet Demo - Main Page
 * 
 * This is the main page of the demo application showcasing LazorKit SDK
 * integration for passkey-based wallet authentication on Solana.
 * 
 * Features demonstrated:
 * 1. Passkey login flow with smart wallet
 * 2. Gasless SOL transfers via Paymaster
 * 3. Pay with Solana payment widget
 */

import { ConnectButton } from "@/components/wallet/ConnectButton";
import { WalletInfo } from "@/components/wallet/WalletInfo";
import { GaslessTransfer } from "@/components/features/GaslessTransfer";
import { PayWithSolana } from "@/components/features/PayWithSolana";

// Demo recipient address (Devnet)
const DEMO_RECIPIENT = "11111111111111111111111111111111";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-gray-950 to-indigo-950/30 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent -z-10" />

      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">🔐</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">LazorKit Demo</h1>
              <p className="text-xs text-gray-500">Passkey Wallet on Solana</p>
            </div>
          </div>

          {/* Connect Button */}
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Passkey-Native
            </span>
            <br />
            <span className="text-white">Solana Wallet</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Sign in with Face ID, Touch ID, or Windows Hello. No seed phrases,
            no browser extensions. Just seamless, secure authentication.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Wallet Info */}
          <WalletInfo />

          {/* Gasless Transfer */}
          <GaslessTransfer />
        </section>

        {/* Pay with Solana Demo */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Pay with Solana Widget
            </h3>
            <p className="text-gray-400">
              A drop-in payment component for accepting crypto payments
            </p>
          </div>

          <div className="flex justify-center">
            <PayWithSolana
              recipient={DEMO_RECIPIENT}
              amount={0.01}
              currency="SOL"
              onSuccess={(sig) => console.log("Payment success:", sig)}
              onError={(err) => console.error("Payment error:", err)}
            />
          </div>
        </section>

        {/* Features List */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔑</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Seedless</h4>
            <p className="text-sm text-gray-400">
              No more seed phrases. Authenticate with biometrics you already use.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⛽</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Gasless</h4>
            <p className="text-sm text-gray-400">
              Transactions sponsored by Paymaster. Users never need SOL for fees.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Smart</h4>
            <p className="text-sm text-gray-400">
              Programmable accounts with spending limits and access controls.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Built with{" "}
              <a
                href="https://lazorkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300"
              >
                LazorKit SDK
              </a>{" "}
              • Deployed on Solana Devnet
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://docs.lazorkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Docs
              </a>
              <a
                href="https://github.com/lazor-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://t.me/lazorkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
