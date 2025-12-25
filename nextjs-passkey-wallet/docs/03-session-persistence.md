# Tutorial 3: Session Persistence Across Devices

This tutorial explains how LazorKit handles session persistence, enabling users to access their wallet across multiple devices and browser sessions without re-authenticating every time.

## How Session Persistence Works

LazorKit leverages the WebAuthn standard for passkey-based authentication. Here's what makes cross-device access possible:

```
┌─────────────────────────────────────────────────────────┐
│                   Passkey Sync Services                  │
├─────────────────┬─────────────────┬─────────────────────┤
│  iCloud Keychain│ Google Password │ Microsoft Account   │
│    (Apple)      │   Manager       │                     │
├─────────────────┴─────────────────┴─────────────────────┤
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │ iPhone   │   │ MacBook  │   │ iPad     │            │
│  │          │   │          │   │          │            │
│  │ Same     │   │ Same     │   │ Same     │            │
│  │ Wallet   │   │ Wallet   │   │ Wallet   │            │
│  └──────────┘   └──────────┘   └──────────┘            │
└─────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Synced Passkeys

Modern passkey providers automatically sync credentials across devices:

| Provider | Sync Service | Devices |
|----------|--------------|---------|
| Apple | iCloud Keychain | iPhone, iPad, Mac |
| Google | Google Password Manager | Android, Chrome |
| Microsoft | Microsoft Account | Windows, Edge |

### 2. Same Passkey = Same Wallet

The smart wallet address is derived from the passkey credential. This means:

- **Device A** creates a passkey → Wallet address: `ABC...123`
- **Device B** syncs the same passkey → Same wallet: `ABC...123`

No manual export/import of keys is needed!

## Built-in Auto-Reconnect

LazorKit automatically attempts to restore the previous session when your app loads:

```tsx
// This happens automatically in LazorkitProvider
// If a previous session exists, connect() will restore it
// without showing the authentication popup

import { useWallet } from "@lazorkit/wallet";

function App() {
  const { isConnected, isConnecting, wallet } = useWallet();

  // On initial load:
  // isConnecting = true (checking for existing session)
  // 
  // If previous session found:
  // isConnected = true, wallet = { smartWallet: "...", ... }
  //
  // If no session:
  // isConnected = false, wallet = null

  if (isConnecting) {
    return <p>Restoring session...</p>;
  }

  return isConnected ? (
    <p>Welcome back, {wallet.smartWallet}</p>
  ) : (
    <button onClick={() => connect()}>Connect</button>
  );
}
```

## Manual Session Check

You can explicitly check and restore sessions:

```tsx
import { useWallet } from "@lazorkit/wallet";
import { useEffect } from "react";

function SessionManager() {
  const { connect, isConnected, wallet } = useWallet();

  useEffect(() => {
    // Attempt to restore session on mount
    const restoreSession = async () => {
      if (!isConnected) {
        try {
          // This will try to restore without showing popup
          // If no valid session, it will silently fail
          await connect({ feeMode: "paymaster" });
        } catch (error) {
          // No existing session, user needs to authenticate
          console.log("No existing session found");
        }
      }
    };

    restoreSession();
  }, []);

  return null;
}
```

## Cross-Device Flow

Here's how a user accesses their wallet on a new device:

### Step 1: Initial Setup (Device A)
```
1. User visits your app
2. Clicks "Connect with Passkey"
3. Creates new passkey with Face ID
4. Smart wallet created: ABC...123
5. Passkey syncs to iCloud Keychain
```

### Step 2: Access on New Device (Device B)
```
1. User visits your app on iPad
2. Clicks "Connect with Passkey"
3. iCloud offers synced passkey
4. Authenticates with Face ID
5. Same wallet restored: ABC...123
```

## Session Storage

LazorKit stores minimal session data in the browser:

```typescript
// Stored in localStorage (simplified)
{
  "lazorkit_session": {
    "credentialId": "cred_abc123...",
    "smartWallet": "ABC...123",
    "timestamp": 1703548800000
  }
}
```

> **Security Note**: Private keys never leave the device's Secure Enclave. Only public identifiers are stored.

## Handling Session States

Build a robust UI that handles all session states:

```tsx
import { useWallet } from "@lazorkit/wallet";

function WalletStatus() {
  const { 
    isConnected, 
    isConnecting, 
    wallet,
    connect,
    disconnect 
  } = useWallet();

  // Loading state - checking for existing session
  if (isConnecting) {
    return (
      <div className="animate-pulse">
        <p>Checking session...</p>
      </div>
    );
  }

  // Connected state
  if (isConnected && wallet) {
    return (
      <div>
        <p>Connected: {wallet.smartWallet.slice(0, 8)}...</p>
        <button onClick={() => disconnect()}>
          Sign Out
        </button>
      </div>
    );
  }

  // Disconnected state
  return (
    <div>
      <p>No wallet connected</p>
      <button onClick={() => connect({ feeMode: "paymaster" })}>
        Connect with Passkey
      </button>
    </div>
  );
}
```

## Clearing Sessions

To sign out and clear the local session:

```tsx
const { disconnect } = useWallet();

// This clears the local session
// The passkey itself remains on the device
disconnect();
```

## Best Practices

### 1. Always Handle Reconnection Gracefully
```tsx
// Show loading state during session check
if (isConnecting) {
  return <Skeleton />;
}
```

### 2. Don't Force Immediate Authentication
```tsx
// ❌ Bad: Forces auth on page load
useEffect(() => {
  connect();
}, []);

// ✅ Good: Shows connect button, lets user decide
return !isConnected && <ConnectButton />;
```

### 3. Persist User Preferences Separately
```tsx
// Wallet session is handled by LazorKit
// Store app-specific preferences in localStorage
localStorage.setItem("user_preferences", JSON.stringify({
  theme: "dark",
  lastUsedRecipient: "...",
}));
```

## Troubleshooting

### Session Not Restoring?

1. **Check browser support**: Ensure WebAuthn is supported
2. **Check passkey sync**: Verify device is signed into iCloud/Google
3. **Clear and retry**: `disconnect()` then `connect()` fresh

### Different Wallet on Different Device?

This happens when passkeys aren't synced:
- Verify both devices use the same Apple ID / Google account
- Check that passkey sync is enabled in settings
- Try accessing from the original device first

## Summary

| Feature | How It Works |
|---------|--------------|
| Auto-reconnect | LazorKit checks for existing session on load |
| Cross-device | Passkeys sync via iCloud/Google/Microsoft |
| Same wallet | Address derived from credential, not device |
| Security | Private keys never leave Secure Enclave |

## Next Steps

- [LazorKit Documentation](https://docs.lazorkit.com) - Full SDK reference
- [WebAuthn Spec](https://www.w3.org/TR/webauthn/) - Understanding passkeys
- [GitHub Repository](https://github.com/lazor-kit) - Source code and examples
