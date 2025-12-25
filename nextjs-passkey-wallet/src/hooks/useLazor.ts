"use client";

/**
 * useLazor Hook
 * 
 * A clean abstraction layer over the LazorKit SDK that provides:
 * - Wallet connection/disconnection
 * - Real balance fetching from Solana RPC
 * - Real-time SOL price from CoinGecko API (with fallback)
 */

import { useWallet } from "@lazorkit/wallet";
import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

// Fallback price if API fails
const FALLBACK_SOL_PRICE = 195;

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  mint: string;
  decimals: number;
  logoUrl: string;
  priceChange24h: number;
}

export interface Transaction {
  signature: string;
  type: "send" | "receive";
  amount: number;
  timestamp: Date;
  status: "confirmed" | "pending" | "failed";
  recipient?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isSigning: boolean;
  solBalance: number;
  solPrice: number;
  totalUsdValue: number;
  tokens: TokenBalance[];
  transactions: Transaction[];
  error: string | null;
}

export function useLazor() {
  const {
    connect: sdkConnect,
    disconnect: sdkDisconnect,
    signMessage: sdkSignMessage,
    signAndSendTransaction,
    wallet,
    isConnecting: sdkIsConnecting,
  } = useWallet();

  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    isSigning: false,
    solBalance: 0,
    solPrice: FALLBACK_SOL_PRICE,
    totalUsdValue: 0,
    tokens: [],
    transactions: [],
    error: null,
  });

  // Fetch real SOL price from CoinGecko with fallback
  const fetchSolPrice = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true',
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      return {
        price: data.solana?.usd || FALLBACK_SOL_PRICE,
        change24h: data.solana?.usd_24h_change || 0,
      };
    } catch (error) {
      // Silently use fallback price
      console.log("Using fallback SOL price");
      return { price: FALLBACK_SOL_PRICE, change24h: 2.5 };
    }
  }, []);

  // Update state when wallet changes
  useEffect(() => {
    if (wallet?.smartWallet) {
      setState(prev => ({
        ...prev,
        address: wallet.smartWallet,
        isConnected: true,
        isConnecting: false,
      }));
      fetchBalance(wallet.smartWallet);
    } else {
      setState(prev => ({
        ...prev,
        address: null,
        isConnected: false,
        solBalance: 0,
        totalUsdValue: 0,
        tokens: [],
      }));
    }
  }, [wallet?.smartWallet]);

  // Fetch real SOL balance from RPC and price
  const fetchBalance = useCallback(async (address: string) => {
    try {
      // Fetch balance and price in parallel
      const [balanceResult, priceResult] = await Promise.all([
        (async () => {
          try {
            const connection = new Connection(RPC_URL);
            const pubkey = new PublicKey(address);
            const balance = await connection.getBalance(pubkey);
            return balance / LAMPORTS_PER_SOL;
          } catch {
            return 0;
          }
        })(),
        fetchSolPrice(),
      ]);

      const solBalance = balanceResult;
      const solPrice = priceResult.price;
      const priceChange24h = priceResult.change24h;
      const usdValue = solBalance * solPrice;
      
      const tokens: TokenBalance[] = [
        {
          symbol: "SOL",
          name: "Solana",
          balance: solBalance,
          usdValue: usdValue,
          mint: "So11111111111111111111111111111111111111112",
          decimals: 9,
          logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          priceChange24h: priceChange24h,
        },
      ];

      setState(prev => ({
        ...prev,
        solBalance,
        solPrice,
        totalUsdValue: usdValue,
        tokens,
      }));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }, [fetchSolPrice]);

  // Connect wallet with passkey
  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      await sdkConnect();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection failed";
      setState(prev => ({ ...prev, error: message, isConnecting: false }));
      throw error;
    }
  }, [sdkConnect]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      await sdkDisconnect();
      setState(prev => ({
        ...prev,
        address: null,
        isConnected: false,
        solBalance: 0,
        solPrice: FALLBACK_SOL_PRICE,
        totalUsdValue: 0,
        tokens: [],
        transactions: [],
      }));
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  }, [sdkDisconnect]);

  // Sign a message
  const signMessage = useCallback(async (message: string) => {
    try {
      setState(prev => ({ ...prev, isSigning: true, error: null }));
      const result = await sdkSignMessage(message);
      setState(prev => ({ ...prev, isSigning: false }));
      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Signing failed";
      setState(prev => ({ ...prev, error: msg, isSigning: false }));
      throw error;
    }
  }, [sdkSignMessage]);

  // Send SOL transaction
  const sendSol = useCallback(async (recipient: string, amount: number) => {
    if (!wallet?.smartWallet) {
      throw new Error("Wallet not connected");
    }

    try {
      setState(prev => ({ ...prev, isSigning: true, error: null }));

      const fromPubkey = new PublicKey(wallet.smartWallet);
      const toPubkey = new PublicKey(recipient);

      const instruction = SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL),
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          computeUnitLimit: 200_000,
        },
      });

      const newTx: Transaction = {
        signature,
        type: "send",
        amount,
        timestamp: new Date(),
        status: "confirmed",
        recipient,
      };

      setState(prev => ({ 
        ...prev, 
        isSigning: false,
        transactions: [newTx, ...prev.transactions],
      }));
      
      fetchBalance(wallet.smartWallet);
      
      return signature;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction failed";
      setState(prev => ({ ...prev, error: errorMessage, isSigning: false }));
      throw error;
    }
  }, [wallet?.smartWallet, signAndSendTransaction, fetchBalance]);

  // Refresh balance
  const refreshBalance = useCallback(() => {
    if (wallet?.smartWallet) {
      fetchBalance(wallet.smartWallet);
    }
  }, [wallet?.smartWallet, fetchBalance]);

  return {
    ...state,
    isConnecting: sdkIsConnecting || state.isConnecting,
    connect,
    disconnect,
    signMessage,
    sendSol,
    refreshBalance,
  };
}
