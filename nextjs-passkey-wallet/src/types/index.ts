/**
 * TypeScript type definitions for the LazorKit integration
 */

// Wallet information returned from LazorKit
export interface WalletInfo {
  smartWallet: string;
  credentialId: string;
}

// Transaction options for signAndSendTransaction
export interface TransactionOptions {
  feeToken?: "SOL" | "USDC";
  computeUnitLimit?: number;
  clusterSimulation?: "devnet" | "mainnet";
}

// Transfer parameters for the GaslessTransfer component
export interface TransferParams {
  recipient: string;
  amount: number;
  feeToken: "SOL" | "USDC";
}

// Payment widget props
export interface PaymentWidgetProps {
  recipient: string;
  amount: number;
  currency: "SOL" | "USDC";
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

// Transaction status
export type TransactionStatus = "idle" | "pending" | "success" | "error";

// Transaction result
export interface TransactionResult {
  status: TransactionStatus;
  signature?: string;
  error?: string;
}
