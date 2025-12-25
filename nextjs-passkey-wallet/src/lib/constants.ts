/**
 * LazorKit Configuration Constants
 * 
 * These are the default configuration values for connecting to LazorKit
 * on Solana Devnet. For production, you would update these to use
 * mainnet endpoints and your own API keys.
 */

// Solana Devnet RPC endpoint
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

// LazorKit authentication portal URL
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh";

// Paymaster configuration for gasless transactions
export const PAYMASTER_CONFIG = {
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://kora.devnet.lazorkit.com",
  // Optional: Add your API key here for higher rate limits
  // apiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY,
};

// Devnet USDC mint address (for gasless USDC transfers)
export const DEVNET_USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

// Explorer URL for viewing transactions
export const EXPLORER_URL = "https://explorer.solana.com";

// Network configuration
export const NETWORK = "devnet";
