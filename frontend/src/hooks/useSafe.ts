/**
 * Safe SDK Integration Hooks
 * 
 * These hooks integrate with Safe Protocol Kit for:
 * - Safe wallet creation
 * - Transaction building
 * - Multi-signature coordination
 * - Transaction execution
 */

import { useState, useCallback } from "react";
import Safe, { SafeFactory, SafeAccountConfig } from "@safe-global/protocol-kit";
import { SafeTransaction } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";

// Safe contract addresses for Arbitrum Sepolia
// TODO: Update with actual addresses from user
const SAFE_CONTRACTS = {
  arbitrumSepolia: {
    safeSingletonAddress: "0x...", // Will be provided by user
    safeProxyFactoryAddress: "0x...", // Will be provided by user
    fallbackHandlerAddress: "0x...", // Will be provided by user
  },
  arbitrumOne: {
    safeSingletonAddress: "0x...",
    safeProxyFactoryAddress: "0x...",
    fallbackHandlerAddress: "0x...",
  },
};

interface UseSafeCreationProps {
  provider: ethers.Provider;
  signer: ethers.Signer;
}

interface SafeCreationParams {
  owners: string[];
  threshold: number;
  saltNonce?: string;
}

/**
 * Hook for creating new Safe wallets
 */
export function useSafeCreation({ provider, signer }: UseSafeCreationProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSafe = useCallback(
    async (params: SafeCreationParams): Promise<string> => {
      setIsCreating(true);
      setError(null);

      try {
        // Initialize Safe Factory
        const safeFactory = await SafeFactory.create({
          ethAdapter: new ethers.Adapter({ provider, signer }),
          safeVersion: "1.4.1",
        });

        // Configure Safe
        const safeAccountConfig: SafeAccountConfig = {
          owners: params.owners,
          threshold: params.threshold,
        };

        // Deploy Safe
        const safe = await safeFactory.deploySafe({
          safeAccountConfig,
          saltNonce: params.saltNonce,
        });

        const safeAddress = await safe.getAddress();
        console.log("Safe created at:", safeAddress);

        return safeAddress;
      } catch (err) {
        console.error("Failed to create Safe:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [provider, signer]
  );

  return { createSafe, isCreating, error };
}

interface UseSafeTransactionsProps {
  safeAddress: string;
  provider: ethers.Provider;
  signer: ethers.Signer;
}

interface TransactionParams {
  to: string;
  value: string;
  data: string;
}

/**
 * Hook for managing Safe transactions
 */
export function useSafeTransactions({
  safeAddress,
  provider,
  signer,
}: UseSafeTransactionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize Safe SDK instance
   */
  const getSafe = useCallback(async (): Promise<Safe> => {
    return await Safe.create({
      ethAdapter: new ethers.Adapter({ provider, signer }),
      safeAddress,
    });
  }, [safeAddress, provider, signer]);

  /**
   * Create a new transaction
   */
  const createTransaction = useCallback(
    async (params: TransactionParams): Promise<SafeTransaction> => {
      setIsLoading(true);
      setError(null);

      try {
        const safe = await getSafe();

        const transaction = {
          to: params.to,
          value: params.value,
          data: params.data,
        };

        const safeTransaction = await safe.createTransaction({
          transactions: [transaction],
        });

        return safeTransaction;
      } catch (err) {
        console.error("Failed to create transaction:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getSafe]
  );

  /**
   * Sign a transaction
   */
  const signTransaction = useCallback(
    async (safeTransaction: SafeTransaction): Promise<SafeTransaction> => {
      setIsLoading(true);
      setError(null);

      try {
        const safe = await getSafe();
        const signedTx = await safe.signTransaction(safeTransaction);
        return signedTx;
      } catch (err) {
        console.error("Failed to sign transaction:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getSafe]
  );

  /**
   * Execute a transaction (requires threshold signatures)
   */
  const executeTransaction = useCallback(
    async (safeTransaction: SafeTransaction): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const safe = await getSafe();
        const txResponse = await safe.executeTransaction(safeTransaction);
        return txResponse.hash;
      } catch (err) {
        console.error("Failed to execute transaction:", err);
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getSafe]
  );

  /**
   * Get transaction status
   */
  const getTransactionStatus = useCallback(async () => {
    try {
      const safe = await getSafe();
      const owners = await safe.getOwners();
      const threshold = await safe.getThreshold();
      const nonce = await safe.getNonce();

      return {
        owners,
        threshold,
        nonce,
      };
    } catch (err) {
      console.error("Failed to get transaction status:", err);
      throw err;
    }
  }, [getSafe]);

  return {
    createTransaction,
    signTransaction,
    executeTransaction,
    getTransactionStatus,
    isLoading,
    error,
  };
}

/**
 * Hook for monitoring Safe events
 */
export function useSafeEvents(safeAddress: string) {
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [executedTransactions, setExecutedTransactions] = useState<any[]>([]);

  // TODO: Implement event listeners for:
  // - ExecutionSuccess
  // - ExecutionFailure
  // - AddedOwner
  // - RemovedOwner
  // - ChangedThreshold

  return {
    pendingTransactions,
    executedTransactions,
  };
}

/**
 * Build a transaction for PrimeVault interactions
 */
export function buildPrimeVaultTransaction(
  vaultAddress: string,
  method: string,
  params: any[]
): TransactionParams {
  // TODO: Add ABI encoder for PrimeVault methods
  const iface = new ethers.Interface([
    // Add PrimeVault ABI fragments here
  ]);

  const data = iface.encodeFunctionData(method, params);

  return {
    to: vaultAddress,
    value: "0",
    data,
  };
}
