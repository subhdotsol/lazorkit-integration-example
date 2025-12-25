import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LazorkitClientProvider } from "@/components/providers/LazorkitProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LazorKit Wallet | Passkey-Native Solana Wallet",
  description:
    "A beautiful passkey-based wallet on Solana. No seed phrases, no extensions, just your fingerprint. Features gasless transactions and stunning UI.",
  keywords: [
    "Solana",
    "Passkey",
    "Smart Wallet",
    "LazorKit",
    "WebAuthn",
    "Gasless",
    "Crypto",
    "Web3",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LazorkitClientProvider>
            {children}
          </LazorkitClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
