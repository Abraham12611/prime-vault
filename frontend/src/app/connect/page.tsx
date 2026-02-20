"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ConnectPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Connect to Prime Vault
            </h1>
            <p className="text-text-secondary">
              Connect your wallet to access institutional DeFi
            </p>
          </div>

          {/* Connect Wallet Button */}
          <div className="card-elevated p-8">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === "authenticated");

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-glow flex items-center justify-center gap-3"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full bg-error hover:bg-error/80 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="w-full flex items-center justify-center gap-2 bg-surface border border-border hover:border-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 16,
                                  height: 16,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    style={{ width: 16, height: 16 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-glow"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ""}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {/* Supported Wallets */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-text-tertiary text-center mb-4">
                Supported wallets
              </p>
              <div className="flex items-center justify-center gap-6">
                {["MetaMask", "WalletConnect", "Coinbase", "Ledger"].map((wallet) => (
                  <div
                    key={wallet}
                    className="flex flex-col items-center gap-1"
                    title={wallet}
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center">
                      <div className="w-4 h-4 bg-text-tertiary rounded-full" />
                    </div>
                    <span className="text-[10px] text-text-tertiary">{wallet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-text-tertiary mt-6">
            By connecting, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
