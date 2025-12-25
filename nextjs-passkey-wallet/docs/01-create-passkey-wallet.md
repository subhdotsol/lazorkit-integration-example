# Tutorial 1: Create a Passkey-Based Wallet

This tutorial walks you through integrating LazorKit to create a passkey-based smart wallet on Solana. By the end, users will be able to authenticate using Face ID, Touch ID, or Windows Hello—no seed phrases required.

## Prerequisites

- Node.js 18+ installed
- Basic knowledge of React and Next.js
- A browser that supports WebAuthn (Chrome, Safari, Firefox, Edge)

## Step 1: Install Dependencies

First, install the LazorKit SDK and Solana libraries:

```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

## Step 2: Set Up the Provider

LazorKit uses a React Context provider to manage wallet state. Create a provider wrapper:

```tsx
// src/components/providers/LazorkitProvider.tsx
"use client";

import { ReactNode } from "react";
import { LazorkitProvider } from "@lazorkit/wallet";

// Polyfill Buffer for Next.js
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: { paymasterUrl: "https://kora.devnet.lazorkit.com" }
};

export function LazorkitClientProvider({ children }: { children: ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}
```

Wrap your app in `layout.tsx`:

```tsx
// src/app/layout.tsx
import { LazorkitClientProvider } from "@/components/providers/LazorkitProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LazorkitClientProvider>
          {children}
        </LazorkitClientProvider>
      </body>
    </html>
  );
}
```

## Step 3: Create the Connect Button

Use the `useWallet` hook to access wallet functionality:

```tsx
// src/components/wallet/ConnectButton.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

  const handleConnect = async () => {
    try {
      // feeMode: "paymaster" enables gasless transactions
      await connect({ feeMode: "paymaster" });
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  if (isConnected && wallet) {
    return (
      <div>
        <span>Connected: {wallet.smartWallet.slice(0, 8)}...</span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect with Passkey"}
    </button>
  );
}
```

## Step 4: Understanding the Authentication Flow

When a user clicks "Connect with Passkey":

1. **Portal Opens**: LazorKit opens a popup to `portal.lazor.sh`
2. **Passkey Prompt**: The browser triggers WebAuthn authentication
3. **Credential Created**: A new passkey is created in the device's Secure Enclave
4. **Smart Wallet Derived**: A PDA (Program Derived Address) is derived from the credential
5. **Session Established**: The wallet info is returned to your app

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│   Your App  │───▶│ LazorKit     │───▶│ Device Secure │
│             │    │ Portal       │    │ Enclave       │
│  connect()  │    │              │    │ (TouchID etc) │
└─────────────┘    └──────────────┘    └───────────────┘
       │                  │                    │
       │                  │                    │
       ▼                  ▼                    ▼
   Popup opens     WebAuthn prompt      Credential created
```

## Step 5: Display Wallet Information

Access the connected wallet's details:

```tsx
// src/components/wallet/WalletInfo.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";

export function WalletInfo() {
  const { isConnected, wallet } = useWallet();

  if (!isConnected || !wallet) {
    return <p>No wallet connected</p>;
  }

  return (
    <div>
      <h3>Smart Wallet</h3>
      <p>Address: {wallet.smartWallet}</p>
      <p>Credential ID: {wallet.credentialId}</p>
      <a 
        href={`https://explorer.solana.com/address/${wallet.smartWallet}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Explorer
      </a>
    </div>
  );
}
```

## Key Concepts

### Smart Wallet Address
The `smartWallet` is a PDA controlled by the LazorKit program. It's derived from your passkey credential, meaning:
- Same passkey = Same wallet address
- Works across devices synced with the same passkey provider (iCloud Keychain, Google Password Manager, etc.)

### Credential ID
A unique identifier for the passkey credential. LazorKit uses this to locate the correct passkey during authentication.

### Fee Mode
- `"paymaster"`: LazorKit sponsors transaction fees (gasless)
- `"user"`: User pays fees in SOL

## Next Steps

- [Tutorial 2: Gasless Transactions](./02-gasless-transactions.md) - Learn how to send transactions without gas fees
- [Tutorial 3: Session Persistence](./03-session-persistence.md) - Handle auto-reconnect and cross-device sync
