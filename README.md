# 🔐 LazorKit Integration Examples

> Production-ready examples demonstrating passkey-based wallet integration on Solana using [LazorKit SDK](https://lazorkit.com)

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat&logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![React Native](https://img.shields.io/badge/React_Native-Expo-000020?style=flat&logo=expo)](https://expo.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ What is LazorKit?

LazorKit is a **passkey-native smart wallet SDK** for Solana that replaces seed phrases with biometric authentication (Face ID, Touch ID, Windows Hello). It provides:

- **🔑 Seedless Onboarding** - Users authenticate with passkeys, no seed phrases needed
- **⛽ Gasless Transactions** - Built-in Paymaster for sponsored transactions
- **🧠 Smart Wallets** - Programmable accounts using PDAs (Program Derived Addresses)
- **🔒 Hardware-Bound Security** - Keys never leave the device's Secure Enclave

---

## 📦 Examples in This Repository

| Example | Framework | Description | Status |
|---------|-----------|-------------|--------|
| [Next.js Passkey Wallet](./examples/nextjs-passkey-wallet) | Next.js 14 | Web app with passkey login, gasless transfers, and payment widget | 🚧 Building |
| [Expo Mobile Wallet](./examples/expo-mobile-wallet) | React Native (Expo) | Mobile app with biometric login and native passkey integration | 📋 Planned |

---

## 🎯 Use Cases Demonstrated

### 1. Passkey Login Flow
Authenticate users with FaceID/TouchID - no wallet extensions or seed phrases required.

```tsx
import { useWallet } from '@lazorkit/wallet';

function ConnectButton() {
  const { connect, disconnect, isConnected, wallet } = useWallet();
  
  return isConnected ? (
    <button onClick={disconnect}>
      Connected: {wallet.smartWallet.slice(0, 8)}...
    </button>
  ) : (
    <button onClick={() => connect({ feeMode: 'paymaster' })}>
      Connect with Passkey
    </button>
  );
}
```

### 2. Gasless Transactions
Execute transactions without requiring users to hold SOL for gas fees.

```tsx
const { signAndSendTransaction } = useWallet();

const signature = await signAndSendTransaction({
  instructions: [transferInstruction],
  transactionOptions: { 
    feeToken: 'USDC'  // Paymaster sponsors gas
  }
});
```

### 3. Pay with Solana Widget
Drop-in payment component for accepting Solana payments.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm, npm, or yarn
- A modern browser with WebAuthn support (Chrome, Safari, Firefox, Edge)

### Run the Next.js Example

```bash
# Clone the repository
git clone https://github.com/yourusername/lazorkit-examples.git
cd lazorkit-examples

# Navigate to the Next.js example
cd examples/nextjs-passkey-wallet

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Tutorials

Step-by-step guides are included in each example:

| Tutorial | Description |
|----------|-------------|
| [Create a Passkey Wallet](./examples/nextjs-passkey-wallet/docs/01-create-passkey-wallet.md) | Set up LazorKit and implement passkey authentication |
| [Gasless Transactions](./examples/nextjs-passkey-wallet/docs/02-gasless-transactions.md) | Execute transactions with Paymaster sponsorship |
| [Session Persistence](./examples/nextjs-passkey-wallet/docs/03-session-persistence.md) | Handle auto-reconnect and cross-device sync |

---

## 🔧 SDK Configuration

### Default Devnet Configuration

```typescript
const CONFIG = {
  // Solana Devnet RPC
  RPC_URL: "https://api.devnet.solana.com",
  
  // LazorKit authentication portal
  PORTAL_URL: "https://portal.lazor.sh",
  
  // Paymaster for gasless transactions
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }
};
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
# Optional: Get an API key from https://portal.lazor.sh
# NEXT_PUBLIC_PAYMASTER_API_KEY=your-api-key
```

---

## 🏗️ Project Structure

```
lazorkit/
├── examples/
│   ├── nextjs-passkey-wallet/     # Next.js web application
│   │   ├── src/
│   │   │   ├── app/               # App router pages
│   │   │   ├── components/        # React components
│   │   │   ├── hooks/             # Custom hooks
│   │   │   └── lib/               # Utilities
│   │   ├── docs/                  # Step-by-step tutorials
│   │   └── README.md
│   │
│   └── expo-mobile-wallet/        # React Native (Expo) app
│       ├── app/                   # Expo Router pages
│       ├── components/            # React Native components
│       └── README.md
│
└── README.md                      # This file
```

---

## 🌐 Live Demo

| Example | Demo URL | Network |
|---------|----------|---------|
| Next.js Wallet | [Coming Soon](#) | Devnet |
| Expo Mobile | [Coming Soon](#) | Devnet |

---

## 📖 Resources

- **LazorKit Documentation**: [docs.lazorkit.com](https://docs.lazorkit.com)
- **Developer Portal**: [portal.lazor.sh](https://portal.lazor.sh)
- **GitHub**: [github.com/lazor-kit](https://github.com/lazor-kit)
- **Telegram**: [t.me/lazorkit](https://t.me/lazorkit)
- **Twitter**: [@lazorkit](https://twitter.com/lazorkit)

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| [LazorKit SDK](https://lazorkit.com) | Passkey wallet infrastructure |
| [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) | Blockchain interaction |
| [Next.js 14](https://nextjs.org) | React web framework |
| [Expo](https://expo.dev) | React Native framework |
| [Tailwind CSS](https://tailwindcss.com) | Styling |

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built for the [Superteam Vietnam Bounty](https://earn.superteam.fun/listing/integrate-passkey-technology-with-lazorkit-to-10x-solana-ux) - Integrate Passkey Technology with LazorKit to 10x Solana UX.

---

<p align="center">
  <strong>Made with ❤️ for the Solana ecosystem</strong>
</p>
