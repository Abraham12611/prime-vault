/**
 * Permissionless.js Integration Hooks
 * 
 * These hooks integrate with permissionless.js for:
 * - Smart account creation (ERC-4337)
 * - UserOperation building
 * - Gas sponsorship
 * - Bundler interactions
 */

import { useState, useCallback } from "react";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia, arbitrum } from "viem/chains";
import {
  createSmartAccountClient,
  bundlerActions,
  type UserOperation,
} from "permissionless";
import { toSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";

// Configuration
const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || "";
const BUNDLER_RPC = `https://api.pimlico.io/v2/arbitrum-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;
const PAYMASTER_RPC = `https://api.pimlico.io/v2/arbitrum-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;

const publicClient = createPublicClient({
  transport: http("https://sepolia-rollup.arbitrum.io/rpc"),
  chain: arbitrumSepolia,
});

interface UseSmartAccountProps {
  ownerAddress: string;
  ownerSigner: any; // viem wallet client
}

interface SmartAccountConfig {
  owners: string[];
  threshold: number;
  saltNonce?: bigint;
}

/**
 * Hook for creating and managing ERC-4337 Smart Accounts
 */
export function useSmartAccount({ ownerAddress, ownerSigner }: UseSmartAccountProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [smartAccountClient, setSmartAccountClient] = useState<any>(null);

  /**
   * Create a new Safe-based Smart Account
   */
  const createSmartAccount = useCallback(
    async (config: SmartAccountConfig) => {
      setIsCreating(true);
      setError(null);

      try {
        // Create Safe Smart Account
        const safeAccount = await toSafeSmartAccount({
          client: publicClient,
          owners: config.owners,
          threshold: config.threshold,
          saltNonce: config.saltNonce,
          entryPoint: {
            address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // EntryPoint v0.6
            version: "0.6",
          },
        });

        setSmartAccount(safeAccount);

        // Create Paymaster Client (for gas sponsorship)
        const paymasterClient = createPimlicoPaymasterClient({
          transport: http(PAYMASTER_RPC),
        });

        // Create Smart Account Client
        const client = createSmartAccountClient({
          account: safeAccount,
          chain: arbitrumSepolia,
          transport: http(BUNDLER_RPC),
          sponsorUserOperation: async (userOperation) => {
            // Sponsor gas using Pimlico paymaster
            return paymasterClient.sponsorUserOperation({
              userOperation,
            });
          },
        });

        setSmartAccountClient(client);

        const address = await safeAccount.getAddress();
        console.log("Smart Account created:", address);

        return {
          address,
          client,
        };
      } catch (err) {
        console.error("Failed to create smart account:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [ownerAddress, ownerSigner]
  );

  /**
   * Send a transaction via UserOperation
   */
  const sendTransaction = useCallback(
    async (tx: {
      to: string;
      value?: bigint;
      data?: string;
    }) => {
      if (!smartAccountClient) {
        throw new Error("Smart account not initialized");
      }

      setIsSending(true);
      setError(null);

      try {
        const txHash = await smartAccountClient.sendTransaction({
          to: tx.to,
          value: tx.value || 0n,
          data: tx.data || "0x",
        });

        console.log("Transaction sent:", txHash);
        return txHash;
      } catch (err) {
        console.error("Failed to send transaction:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [smartAccountClient]
  );

  /**
   * Send a batch of transactions
   */
  const sendBatchTransaction = useCallback(
    async (
      txs: {
        to: string;
        value?: bigint;
        data?: string;
      }[]
    ) => {
      if (!smartAccountClient) {
        throw new Error("Smart account not initialized");
      }

      setIsSending(true);
      setError(null);

      try {
        // Encode batch transactions
        const calls = txs.map((tx) => ({
          to: tx.to,
          value: tx.value || 0n,
          data: tx.data || "0x",
        }));

        // Execute via multiCall (if supported) or individual transactions
        const txHash = await smartAccountClient.sendTransaction({
          calls,
        });

        console.log("Batch transaction sent:", txHash);
        return txHash;
      } catch (err) {
        console.error("Failed to send batch transaction:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [smartAccountClient]
  );

  /**
   * Get account information
   */
  const getAccountInfo = useCallback(async () => {
    if (!smartAccount) return null;

    try {
      const address = await smartAccount.getAddress();
      const nonce = await smartAccount.getNonce();

      return {
        address,
        nonce,
      };
    } catch (err) {
      console.error("Failed to get account info:", err);
      throw err;
    }
  }, [smartAccount]);

  return {
    smartAccount,
    smartAccountClient,
    createSmartAccount,
    sendTransaction,
    sendBatchTransaction,
    getAccountInfo,
    isCreating,
    isSending,
    error,
  };
}

/**
 * Hook for sponsoring gas for other users
 */
export function useGasSponsorship() {
  const [isSponsoring, setIsSponsoring] = useState(false);

  const sponsorUserOperation = useCallback(
    async (userOperation: UserOperation) => {
      setIsSponsoring(true);

      try {
        const paymasterClient = createPimlicoPaymasterClient({
          transport: http(PAYMASTER_RPC),
        });

        const sponsoredUserOperation =
          await paymasterClient.sponsorUserOperation({
            userOperation,
          });

        return sponsoredUserOperation;
      } catch (err) {
        console.error("Failed to sponsor operation:", err);
        throw err;
      } finally {
        setIsSponsoring(false);
      }
    },
    []
  );

  return {
    sponsorUserOperation,
    isSponsoring,
  };
}

/**
 * Hook for monitoring UserOperation status
 */
export function useUserOperationStatus(userOperationHash?: string) {
  const [status, setStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);
  const [receipt, setReceipt] = useState<any>(null);

  // TODO: Implement polling for UserOperation receipt
  // Use bundler_getUserOperationReceipt

  return {
    status,
    receipt,
    isPending: status === "pending",
    isSuccess: status === "success",
    isFailed: status === "failed",
  };
}

/**
 * Build a UserOperation for PrimeVault interactions
 */
export function buildPrimeVaultUserOperation(
  vaultAddress: string,
  method: string,
  params: any[],
  abi: any[]
): {
  to: string;
  data: string;
  value: bigint;
} {
  // Encode function call
  const data = encodeFunctionData({
    abi,
    functionName: method,
    args: params,
  });

  return {
    to: vaultAddress,
    data,
    value: 0n,
  };
}

// Helper function for encoding
function encodeFunctionData({
  abi,
  functionName,
  args,
}: {
  abi: any[];
  functionName: string;
  args: any[];
}): string {
  // TODO: Implement with viem or ethers
  // This is a placeholder
  return "0x";
}
