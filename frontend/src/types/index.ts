// ==================== INSTITUTION TYPES ====================

export interface Institution {
  id: string;
  name: string;
  safeAddress: string;
  ownerAddresses: string[];
  threshold: number;
  isActive: boolean;
  createdAt: number;
}

export interface InstitutionConfig {
  institutionId: string;
  safeWallet: string;
  minCollateralRatio: number; // In basis points (e.g., 15000 = 150%)
  maxPositionSize: string; // In wei
  dailyTradeLimit: string; // In wei
  gracePeriod: number; // In seconds
  isActive: boolean;
}

// ==================== PORTFOLIO TYPES ====================

export interface Position {
  id: string;
  institutionId: string;
  asset: string;
  assetName: string;
  assetSymbol: string;
  assetDecimals: number;
  amount: string; // In wei
  entryPrice: number; // USD price at entry
  currentPrice: number; // Current USD price
  entryTimestamp: number;
  positionType: "long" | "short";
}

export interface Portfolio {
  institutionId: string;
  totalValue: number; // USD
  totalCollateral: number; // USD
  totalDebt: number; // USD
  collateralRatio: number; // In basis points
  positions: Position[];
  lastUpdated: number;
}

// ==================== TRADING TYPES ====================

export interface TradeParams {
  protocol: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string; // In wei
  minAmountOut: string; // In wei
  slippageTolerance: number; // In basis points
  isCollateralUpdate: boolean;
}

export interface TradePreview {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  amountOut: string;
  exchangeRate: number;
  priceImpact: number;
  minimumReceived: string;
  gasEstimate: string;
  protocolFee: string;
  postTradeCollateralRatio: number;
  isValid: boolean;
  errorMessage?: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  priceUSD?: number;
}

// ==================== TRANSACTION TYPES ====================

export type TransactionType = "swap" | "deposit" | "withdraw" | "governance" | "risk_update";
export type TransactionStatus = "pending" | "success" | "failed";

export interface Transaction {
  id: string;
  hash: string;
  institutionId: string;
  type: TransactionType;
  status: TransactionStatus;
  tokenIn?: TokenInfo;
  tokenOut?: TokenInfo;
  amountIn?: string;
  amountOut?: string;
  valueUSD: number;
  gasUsed?: string;
  timestamp: number;
  confirmations: number;
  requiredConfirmations: number;
  signers: string[];
}

// ==================== GOVERNANCE TYPES ====================

export interface GovernanceProposal {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  transactionData: string;
  to: string;
  value: string;
  submittedBy: string;
  submittedAt: number;
  status: "pending" | "executed" | "rejected" | "cancelled";
  signatures: Signature[];
  requiredSignatures: number;
  executedAt?: number;
}

export interface Signature {
  signer: string;
  signature: string;
  timestamp: number;
}

// ==================== RISK TYPES ====================

export interface RiskParams {
  minCollateralRatio: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  maxPositionSize: string;
  dailyTradeLimit: string;
  maxDrawdown: number;
}

export interface RiskMetrics {
  institutionId: string;
  riskScore: number; // 0-100
  collateralRatio: number;
  liquidationPrice: number;
  availableMargin: number;
  currentLeverage: number;
  maxDrawdown: number;
  dailyVolumeUsed: number;
  largestPositionConcentration: number;
  liquidationBuffer: number;
  approvedProtocolsUsed: number;
  isHealthy: boolean;
  isLiquidatable: boolean;
}

export interface RiskAlert {
  id: string;
  institutionId: string;
  type: "info" | "warning" | "critical";
  title: string;
  message: string;
  metric: string;
  currentValue: number;
  thresholdValue: number;
  timestamp: number;
  isRead: boolean;
}

// ==================== CHART TYPES ====================

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface PortfolioChartData {
  totalValue: ChartDataPoint[];
  benchmark?: ChartDataPoint[];
}

export interface AllocationItem {
  asset: string;
  symbol: string;
  value: number;
  percentage: number;
  color: string;
}

// ==================== UI TYPES ====================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  subItems?: NavItem[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

// ==================== PROTOCOL TYPES ====================

export interface Protocol {
  id: string;
  name: string;
  address: string;
  logoURI: string;
  tvl: number;
  isApproved: boolean;
  supportedChains: number[];
  protocols: string[]; // e.g., ["uniswap-v3", "curve"]
}

// ==================== API TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ==================== USER TYPES ====================

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  role: "admin" | "trader" | "viewer";
  institutionId?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: number;
  lastLoginAt: number;
}

// ==================== SETTINGS TYPES ====================

export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    tradeExecutions: boolean;
    governanceActions: boolean;
    riskAlerts: boolean;
    securityEvents: boolean;
    weeklySummaries: boolean;
  };
  preferences: {
    defaultSlippage: number;
    defaultGasSpeed: "slow" | "standard" | "fast";
    autoApproveSmallTrades: boolean;
    smallTradeThreshold: string;
  };
}
