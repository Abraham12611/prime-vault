"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { argentWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, arbitrumSepolia, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// Configure chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum, arbitrumSepolia, hardhat],
  [publicProvider()]
);

// Configure wallets
const { wallets } = getDefaultWallets({
  appName: "Prime Vault",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "", chains }),
      ledgerWallet({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "", chains }),
    ],
  },
]);

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Custom RainbowKit theme
const customTheme = darkTheme({
  accentColor: "#0052FF",
  accentColorForeground: "#FFFFFF",
  borderRadius: "medium",
  fontStack: "system",
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          theme={customTheme}
          modalSize="compact"
          appInfo={{
            appName: "Prime Vault",
            learnMoreUrl: "https://docs.primevault.io",
          }}
        >
          {mounted ? children : null}
        </RainbowKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}
