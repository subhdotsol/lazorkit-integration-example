import { PublicKey } from "@solana/web3.js";
import { EXPLORER_URL, NETWORK } from "./constants";

/**
 * Truncates a wallet address for display
 * @param address - The full wallet address
 * @param chars - Number of characters to show on each end (default: 4)
 * @returns Truncated address like "ABCD...WXYZ"
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Validates if a string is a valid Solana public key
 * @param address - The address to validate
 * @returns true if valid, false otherwise
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a SOL amount from lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Formatted SOL amount
 */
export function formatSol(lamports: number): string {
  return (lamports / 1e9).toFixed(4);
}

/**
 * Formats a USDC amount from raw units to human-readable
 * @param amount - Raw USDC amount (6 decimals)
 * @returns Formatted USDC amount
 */
export function formatUsdc(amount: number): string {
  return (amount / 1e6).toFixed(2);
}

/**
 * Gets the Solana Explorer URL for a transaction
 * @param signature - Transaction signature
 * @returns Explorer URL
 */
export function getExplorerUrl(signature: string): string {
  return `${EXPLORER_URL}/tx/${signature}?cluster=${NETWORK}`;
}

/**
 * Gets the Solana Explorer URL for an account
 * @param address - Account address
 * @returns Explorer URL
 */
export function getAccountExplorerUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}?cluster=${NETWORK}`;
}

/**
 * Delay utility for async operations
 * @param ms - Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
