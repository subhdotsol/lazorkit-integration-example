# LazorKit Next.js Passkey Wallet Example

A production-ready example demonstrating passkey-based wallet integration on Solana using [LazorKit SDK](https://lazorkit.com) with Next.js 14.

![LazorKit Demo](https://img.shields.io/badge/Network-Devnet-9945FF?style=flat&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)

## ✨ Features

- **🔑 Passkey Authentication** - Sign in with Face ID, Touch ID, or Windows Hello
- **⛽ Gasless Transactions** - Send SOL without paying gas fees (Paymaster)
- **💳 Payment Widget** - Drop-in "Pay with Solana" component
- **🔄 Session Persistence** - Auto-reconnect across browser sessions
- **📱 Responsive Design** - Works on desktop and mobile browsers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A browser with WebAuthn support (Chrome, Safari, Firefox, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lazorkit-examples.git
cd lazorkit-examples/examples/nextjs-passkey-wallet

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextjs-passkey-wallet/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with LazorkitProvider
│   │   ├── page.tsx            # Main demo page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── providers/
│   │   │   └── LazorkitProvider.tsx  # Configured SDK provider
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Reusable button component
│   │   │   ├── Card.tsx        # Card container component
│   │   │   └── Input.tsx       # Form input component
│   │   ├── wallet/
│   │   │   ├── ConnectButton.tsx    # Passkey connect/disconnect
│   │   │   └── WalletInfo.tsx       # Wallet details display
│   │   └── features/
│   │       ├── GaslessTransfer.tsx  # SOL transfer with Paymaster
│   │       └── PayWithSolana.tsx    # Payment widget component
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── constants.ts        # Configuration constants
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript definitions
├── docs/
│   ├── 01-create-passkey-wallet.md
│   ├── 02-gasless-transactions.md
│   └── 03-session-persistence.md
├── .env.example
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Solana RPC (Devnet)
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# LazorKit Portal
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh

# Paymaster for gasless transactions
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com

# Optional: API key for higher rate limits
# NEXT_PUBLIC_PAYMASTER_API_KEY=your-key
```

### SDK Configuration

The SDK is configured in `src/components/providers/LazorkitProvider.tsx`:

```tsx
<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }}
>
  {children}
</LazorkitProvider>
```

## 📚 Tutorials

| Tutorial | Description |
|----------|-------------|
| [Create a Passkey Wallet](./docs/01-create-passkey-wallet.md) | Set up LazorKit and implement authentication |
| [Gasless Transactions](./docs/02-gasless-transactions.md) | Execute transactions with Paymaster |
| [Session Persistence](./docs/03-session-persistence.md) | Auto-reconnect and cross-device access |

## 🎯 Use Cases Demonstrated

### 1. Passkey Login

```tsx
import { useWallet } from "@lazorkit/wallet";

function ConnectButton() {
  const { connect, isConnected } = useWallet();
  
  return (
    <button onClick={() => connect({ feeMode: "paymaster" })}>
      {isConnected ? "Connected" : "Connect with Passkey"}
    </button>
  );
}
```

### 2. Gasless Transfer

```tsx
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

function Transfer() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  
  const send = async () => {
    const instruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: recipientPubkey,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    });
    
    // Gasless! Paymaster sponsors the fee
    const signature = await signAndSendTransaction({
      instructions: [instruction],
      transactionOptions: { feeToken: "USDC" }
    });
  };
}
```

### 3. Payment Widget

```tsx
import { PayWithSolana } from "@/components/features/PayWithSolana";

function Checkout() {
  return (
    <PayWithSolana
      recipient="MERCHANT_WALLET_ADDRESS"
      amount={1.5}
      currency="SOL"
      onSuccess={(sig) => console.log("Paid!", sig)}
    />
  );
}
```

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

### Environment Variables on Vercel

Add these in your Vercel project settings:

- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_PORTAL_URL`
- `NEXT_PUBLIC_PAYMASTER_URL`

## 📖 Resources

- [LazorKit Documentation](https://docs.lazorkit.com)
- [LazorKit GitHub](https://github.com/lazor-kit)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

Built with ❤️ for the Solana ecosystem
