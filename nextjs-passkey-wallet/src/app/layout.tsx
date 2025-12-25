import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LazorkitClientProvider } from "@/components/providers/LazorkitProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LazorKit Passkey Wallet | Solana Smart Wallet Demo",
  description:
    "A demo application showcasing passkey-based wallet authentication on Solana using LazorKit SDK. Features include gasless transactions and Pay with Solana widget.",
  keywords: [
    "Solana",
    "Passkey",
    "Smart Wallet",
    "LazorKit",
    "WebAuthn",
    "Gasless",
    "Crypto",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-gray-950 text-white`}>
        <LazorkitClientProvider>{children}</LazorkitClientProvider>
      </body>
    </html>
  );
}
