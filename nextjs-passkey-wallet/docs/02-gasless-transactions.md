# Tutorial 2: Gasless Transactions

This tutorial explains how to execute gasless transactions on Solana using LazorKit's Paymaster integration. Users can send SOL or tokens without needing to hold SOL for transaction fees.

## How Gasless Transactions Work

Traditional Solana transactions require SOL for fees. LazorKit's Paymaster changes this:

```
Traditional Flow:
User ──▶ Signs Tx ──▶ Pays Fee (SOL) ──▶ Transaction Sent

LazorKit Gasless Flow:
User ──▶ Signs Tx ──▶ Paymaster Pays Fee ──▶ Transaction Sent
                           ▲
                           │
                    (Sponsored by LazorKit)
```

## Step 1: Understanding the signAndSendTransaction Method

The `useWallet` hook provides `signAndSendTransaction` for executing transactions:

```tsx
const { signAndSendTransaction, smartWalletPubkey } = useWallet();

const signature = await signAndSendTransaction({
  instructions: [/* your instructions */],
  transactionOptions: {
    feeToken: "USDC",  // Optional: pay fees in USDC
    computeUnitLimit: 200_000,  // Optional: set compute limit
  }
});
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instructions` | `TransactionInstruction[]` | Solana instructions to execute |
| `transactionOptions.feeToken` | `"SOL" \| "USDC"` | Token to use for fee payment |
| `transactionOptions.computeUnitLimit` | `number` | Optional compute unit limit |

## Step 2: Build a SOL Transfer Instruction

Create a simple SOL transfer:

```tsx
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Get the smart wallet public key
const { smartWalletPubkey, signAndSendTransaction } = useWallet();

// Create transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,  // From smart wallet
  toPubkey: new PublicKey("RECIPIENT_ADDRESS"),
  lamports: 0.1 * LAMPORTS_PER_SOL,  // 0.1 SOL
});
```

## Step 3: Execute the Gasless Transfer

Combine everything into a complete transfer function:

```tsx
// src/components/features/GaslessTransfer.tsx
"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export function GaslessTransfer() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [signature, setSignature] = useState(null);

  const handleTransfer = async () => {
    if (!smartWalletPubkey) return;

    try {
      setStatus("pending");

      // 1. Create the transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: new PublicKey(recipient),
        lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
      });

      // 2. Sign and send with Paymaster (gasless!)
      const txSignature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC",  // Let Paymaster handle fees
        },
      });

      setSignature(txSignature);
      setStatus("success");
      console.log("Transaction confirmed:", txSignature);
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus("error");
    }
  };

  if (!isConnected) {
    return <p>Connect your wallet first</p>;
  }

  return (
    <div>
      <h3>Gasless Transfer</h3>
      
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <button 
        onClick={handleTransfer}
        disabled={status === "pending"}
      >
        {status === "pending" ? "Sending..." : "Send SOL (Gasless)"}
      </button>

      {status === "success" && signature && (
        <p>
          ✓ Success!{" "}
          <a 
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
          >
            View on Explorer
          </a>
        </p>
      )}
    </div>
  );
}
```

## Step 4: Verify on Solana Explorer

After a successful transaction:

1. Click the explorer link or go to [explorer.solana.com](https://explorer.solana.com)
2. Make sure you're on **Devnet**
3. Search for your transaction signature
4. Notice that the **fee payer is NOT your wallet** - it's the Paymaster!

```
Transaction Details:
├── Signature: 5KL...xyz
├── Status: Success
├── Fee: 0.000005 SOL
└── Fee Payer: Paymaster Address (not your wallet!)
```

## Understanding Fee Tokens

The `feeToken` option determines how fees are handled:

| feeToken | Behavior |
|----------|----------|
| `"USDC"` | Paymaster sponsors fees, deducts USDC from user (if configured) |
| `"SOL"` | User pays fees in SOL from their wallet |
| `undefined` | Default Paymaster behavior (usually sponsored) |

> **Note**: On Devnet, the LazorKit Paymaster typically sponsors all fees for testing purposes.

## Error Handling Best Practices

```tsx
const handleTransfer = async () => {
  try {
    // ... transfer logic
  } catch (error) {
    if (error.message.includes("insufficient funds")) {
      setError("Insufficient balance for this transfer");
    } else if (error.message.includes("user rejected")) {
      setError("Transaction was cancelled");
    } else {
      setError("Transaction failed. Please try again.");
    }
    console.error("Transfer error:", error);
  }
};
```

## Advanced: Multiple Instructions

You can batch multiple instructions in a single transaction:

```tsx
const instructions = [
  // Transfer 1
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient1,
    lamports: 0.05 * LAMPORTS_PER_SOL,
  }),
  // Transfer 2
  SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: recipient2,
    lamports: 0.05 * LAMPORTS_PER_SOL,
  }),
];

const signature = await signAndSendTransaction({
  instructions,
  transactionOptions: { feeToken: "USDC" },
});
```

## Next Steps

- [Tutorial 3: Session Persistence](./03-session-persistence.md) - Learn about auto-reconnect and cross-device sync
- [LazorKit API Reference](https://docs.lazorkit.com/react-sdk/use-wallet) - Full API documentation
