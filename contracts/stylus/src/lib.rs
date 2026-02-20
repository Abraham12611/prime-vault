#![no_std]
#![no_main]

extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{Address, FixedBytes, I256, U256},
    alloy_sol_types::{sol, SolCall},
    call::{transfer_eth, Call},
    contract, debug, evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageBool, StorageMap, StorageU256, StorageVec},
    tx,
};

// Import mini_alloc for heap allocation
use mini_alloc::MiniAlloc;

#[global_allocator]
static ALLOC: MiniAlloc = MiniAlloc::INIT;

// Define error types
#[derive(SolidityError)]
pub enum PrimeVaultError {
    Unauthorized,
    InvalidAmount,
    InsufficientCollateral,
    RiskLimitExceeded,
    InvalidProtocol,
    NotInitialized,
    AlreadyInitialized,
    InvalidPrice,
    ZeroAddress,
}

// Struct for position tracking
#[derive(Clone)]
pub struct Position {
    pub asset: Address,
    pub amount: U256,
    pub entry_price: U256,
    pub position_type: u8, // 0 = long, 1 = short
    pub timestamp: u64,
}

// Struct for trade parameters
#[derive(Clone)]
pub struct TradeParams {
    pub protocol: Address,
    pub token_in: Address,
    pub token_out: Address,
    pub amount_in: U256,
    pub min_amount_out: U256,
    pub is_collateral_update: bool,
}

// Struct for institution configuration
#[derive(Clone)]
pub struct InstitutionConfig {
    pub institution_id: U256,
    pub safe_wallet: Address,
    pub min_collateral_ratio: U256, // In basis points (e.g., 15000 = 150%)
    pub max_position_size: U256,
    pub daily_trade_limit: U256,
    pub grace_period: u64, // In seconds
    pub is_active: bool,
}

// Solidity interface for Chainlink Price Feed
sol_interface! {
    interface IPriceFeed {
        function latestRoundData() external view returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
        function decimals() external view returns (uint8);
    }
}

// Solidity interface for ERC20
sol_interface! {
    interface IERC20 {
        function balanceOf(address account) external view returns (uint256);
        function transfer(address recipient, uint256 amount) external returns (bool);
        function approve(address spender, uint256 amount) external returns (bool);
        function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
        function decimals() external view returns (uint8);
    }
}

// Solidity interface for Safe Wallet
sol_interface! {
    interface ISafe {
        function execTransaction(
            address to,
            uint256 value,
            bytes calldata data,
            uint8 operation,
            uint256 safeTxGas,
            uint256 baseGas,
            uint256 gasPrice,
            address gasToken,
            address payable refundReceiver,
            bytes calldata signatures
        ) external payable returns (bool success);
        function getThreshold() external view returns (uint256);
        function getOwners() external view returns (address[] memory);
        function isOwner(address owner) external view returns (bool);
    }
}

// Define events
sol! {
    event InstitutionRegistered(uint256 indexed institutionId, address indexed safeWallet);
    event TradeExecuted(uint256 indexed institutionId, address indexed protocol, uint256 amount);
    event CollateralDeposited(uint256 indexed institutionId, address indexed token, uint256 amount);
    event CollateralWithdrawn(uint256 indexed institutionId, address indexed token, uint256 amount);
    event RiskLimitUpdated(uint256 indexed institutionId, string limitType, uint256 newValue);
    event LiquidationTriggered(uint256 indexed institutionId, uint256 collateralSold, uint256 debtRepaid);
    event ProtocolApproved(address indexed protocol);
    event ProtocolRevoked(address indexed protocol);
}

#[storage]
pub struct PrimeVault {
    // Institution data
    institutions: StorageMap<U256, InstitutionStorage>,
    institution_counter: StorageU256,

    // Approved protocols (DEXs, lending platforms)
    approved_protocols: StorageMap<Address, StorageBool>,

    // Price feeds for assets (asset => price feed address)
    price_feeds: StorageMap<Address, StorageAddress>,

    // Admin
    owner: StorageAddress,

    // Protocol parameters
    liquidation_bonus: StorageU256,     // In basis points
    liquidation_threshold: StorageU256, // In basis points
    protocol_fee: StorageU256,          // In basis points

    // Tracking
    total_tvl: StorageU256,
    paused: StorageBool,
}

// Storage for each institution
#[storage]
pub struct InstitutionStorage {
    config: InstitutionConfigStorage,
    positions: StorageMap<Address, PositionStorage>, // asset => position
    collateral_tokens: StorageVec<StorageAddress>,
    daily_volume: StorageU256,
    last_trade_timestamp: StorageU256,
    total_collateral_value: StorageU256,
    total_debt_value: StorageU256,
}

#[storage]
pub struct InstitutionConfigStorage {
    institution_id: StorageU256,
    safe_wallet: StorageAddress,
    min_collateral_ratio: StorageU256,
    max_position_size: StorageU256,
    daily_trade_limit: StorageU256,
    grace_period: StorageU256,
    is_active: StorageBool,
}

#[storage]
pub struct PositionStorage {
    asset: StorageAddress,
    amount: StorageU256,
    entry_price: StorageU256,
    position_type: StorageU256,
    timestamp: StorageU256,
}

// Constants
const BPS: u64 = 10000; // Basis points (100%)
const PRICE_PRECISION: u64 = 8; // Chainlink price precision
const SECONDS_PER_DAY: u64 = 86400;

#[public]
impl PrimeVault {
    // Initialize contract
    pub fn init(&mut self) -> Result<(), PrimeVaultError> {
        if self.owner.get() != Address::ZERO {
            return Err(PrimeVaultError::AlreadyInitialized);
        }

        self.owner.set(msg::sender());
        self.institution_counter.set(U256::from(0));
        self.liquidation_bonus.set(U256::from(500)); // 5%
        self.liquidation_threshold.set(U256::from(11000)); // 110%
        self.protocol_fee.set(U256::from(30)); // 0.3%
        self.paused.set(false);

        Ok(())
    }

    // Register a new institution
    pub fn register_institution(
        &mut self,
        safe_wallet: Address,
        min_collateral_ratio: U256,
        max_position_size: U256,
        daily_trade_limit: U256,
        grace_period: u64,
    ) -> Result<U256, PrimeVaultError> {
        self.only_owner()?;

        if safe_wallet == Address::ZERO {
            return Err(PrimeVaultError::ZeroAddress);
        }

        let institution_id = self.institution_counter.get() + U256::from(1);
        self.institution_counter.set(institution_id);

        let mut inst = self.institutions.setter(institution_id);
        inst.config.institution_id.set(institution_id);
        inst.config.safe_wallet.set(safe_wallet);
        inst.config.min_collateral_ratio.set(min_collateral_ratio);
        inst.config.max_position_size.set(max_position_size);
        inst.config.daily_trade_limit.set(daily_trade_limit);
        inst.config.grace_period.set(U256::from(grace_period));
        inst.config.is_active.set(true);
        inst.daily_volume.set(U256::from(0));
        inst.total_collateral_value.set(U256::from(0));
        inst.total_debt_value.set(U256::from(0));

        // Emit event
        evm::log(InstitutionRegistered {
            institutionId: institution_id,
            safeWallet: safe_wallet,
        });

        Ok(institution_id)
    }

    // Validate trade before execution
    pub fn validate_trade(
        &self,
        institution_id: U256,
        params: TradeParams,
    ) -> Result<bool, PrimeVaultError> {
        self.when_not_paused()?;

        let inst = self.institutions.get(institution_id);
        if !inst.config.is_active.get() {
            return Err(PrimeVaultError::NotInitialized);
        }

        // Check protocol is approved
        if !self.approved_protocols.get(params.protocol) {
            return Err(PrimeVaultError::InvalidProtocol);
        }

        // Check position size limit
        if params.amount_in > inst.config.max_position_size.get() {
            return Err(PrimeVaultError::RiskLimitExceeded);
        }

        // Check daily trade limit
        let current_time = block_timestamp();
        let last_trade = inst.last_trade_timestamp.get().as_u64();

        if current_time - last_trade > SECONDS_PER_DAY {
            // Reset daily volume if new day
            // Note: In real implementation, use proper daily tracking
        }

        let new_daily_volume = inst.daily_volume.get() + params.amount_in;
        if new_daily_volume > inst.config.daily_trade_limit.get() {
            return Err(PrimeVaultError::RiskLimitExceeded);
        }

        // Calculate post-trade collateral ratio if this is a collateral update
        if params.is_collateral_update {
            let new_ratio = self.calculate_collateral_ratio_post_trade(institution_id, &params)?;

            if new_ratio < inst.config.min_collateral_ratio.get() {
                return Err(PrimeVaultError::InsufficientCollateral);
            }
        }

        Ok(true)
    }

    // Record executed trade
    pub fn record_trade(
        &mut self,
        institution_id: U256,
        protocol: Address,
        amount: U256,
        token_in: Address,
        token_out: Address,
        amount_out: U256,
    ) -> Result<(), PrimeVaultError> {
        self.only_institution_safe(institution_id)?;

        let mut inst = self.institutions.setter(institution_id);

        // Update daily volume
        let new_volume = inst.daily_volume.get() + amount;
        inst.daily_volume.set(new_volume);
        inst.last_trade_timestamp.set(U256::from(block_timestamp()));

        // Update positions (simplified - real implementation would track properly)
        self.update_position(institution_id, token_out, amount_out, true)?;

        // Update TVL
        let new_tvl = self.total_tvl.get() + amount;
        self.total_tvl.set(new_tvl);

        // Emit event
        evm::log(TradeExecuted {
            institutionId: institution_id,
            protocol,
            amount,
        });

        Ok(())
    }

    // Calculate portfolio value
    pub fn calculate_portfolio_value(&self, institution_id: U256) -> Result<U256, PrimeVaultError> {
        let inst = self.institutions.get(institution_id);
        let mut total_value = U256::from(0);

        // Sum up all position values
        // Note: In full implementation, iterate through all positions
        // and calculate value using price feeds

        // For now, return tracked collateral value
        total_value = inst.total_collateral_value.get();

        Ok(total_value)
    }

    // Calculate collateral ratio
    pub fn calculate_collateral_ratio(
        &self,
        institution_id: U256,
    ) -> Result<U256, PrimeVaultError> {
        let inst = self.institutions.get(institution_id);

        let collateral_value = inst.total_collateral_value.get();
        let debt_value = inst.total_debt_value.get();

        if debt_value == U256::from(0) {
            return Ok(U256::from(BPS)); // 100% if no debt
        }

        // Ratio = (collateral / debt) * 10000
        let ratio = (collateral_value * U256::from(BPS)) / debt_value;

        Ok(ratio)
    }

    // Get asset price from Chainlink
    pub fn get_asset_price(&self, asset: Address) -> Result<U256, PrimeVaultError> {
        let price_feed = self.price_feeds.get(asset);

        if price_feed == Address::ZERO {
            return Err(PrimeVaultError::InvalidPrice);
        }

        let feed = IPriceFeed::new(price_feed);
        let (round_id, answer, started_at, updated_at, answered_in_round) =
            feed.latest_roundData(self)?;

        // Check price is fresh (updated within last hour)
        let current_time = block_timestamp();
        if current_time - updated_at.as_u64() > 3600 {
            return Err(PrimeVaultError::InvalidPrice);
        }

        // Convert to U256 (price is positive)
        if answer < I256::from(0) {
            return Err(PrimeVaultError::InvalidPrice);
        }

        Ok(U256::from(answer.as_u64()))
    }

    // Check if institution needs liquidation
    pub fn check_liquidation_needed(&self, institution_id: U256) -> Result<bool, PrimeVaultError> {
        let ratio = self.calculate_collateral_ratio(institution_id)?;
        let threshold = self.liquidation_threshold.get();

        Ok(ratio < threshold)
    }

    // Admin functions
    pub fn approve_protocol(&mut self, protocol: Address) -> Result<(), PrimeVaultError> {
        self.only_owner()?;

        let mut approved = self.approved_protocols.setter(protocol);
        approved.set(true);

        evm::log(ProtocolApproved { protocol });

        Ok(())
    }

    pub fn revoke_protocol(&mut self, protocol: Address) -> Result<(), PrimeVaultError> {
        self.only_owner()?;

        let mut approved = self.approved_protocols.setter(protocol);
        approved.set(false);

        evm::log(ProtocolRevoked { protocol });

        Ok(())
    }

    pub fn set_price_feed(
        &mut self,
        asset: Address,
        price_feed: Address,
    ) -> Result<(), PrimeVaultError> {
        self.only_owner()?;

        let mut feed = self.price_feeds.setter(asset);
        feed.set(price_feed);

        Ok(())
    }

    pub fn pause(&mut self) -> Result<(), PrimeVaultError> {
        self.only_owner()?;
        self.paused.set(true);
        Ok(())
    }

    pub fn unpause(&mut self) -> Result<(), PrimeVaultError> {
        self.only_owner()?;
        self.paused.set(false);
        Ok(())
    }

    // View functions
    pub fn get_institution_config(&self, institution_id: U256) -> InstitutionConfigView {
        let inst = self.institutions.get(institution_id);

        InstitutionConfigView {
            institution_id: inst.config.institution_id.get(),
            safe_wallet: inst.config.safe_wallet.get(),
            min_collateral_ratio: inst.config.min_collateral_ratio.get(),
            max_position_size: inst.config.max_position_size.get(),
            daily_trade_limit: inst.config.daily_trade_limit.get(),
            grace_period: inst.config.grace_period.get().as_u64(),
            is_active: inst.config.is_active.get(),
        }
    }

    pub fn get_institution_counter(&self) -> U256 {
        self.institution_counter.get()
    }

    pub fn is_protocol_approved(&self, protocol: Address) -> bool {
        self.approved_protocols.get(protocol)
    }

    // Internal functions
    fn only_owner(&self) -> Result<(), PrimeVaultError> {
        if msg::sender() != self.owner.get() {
            return Err(PrimeVaultError::Unauthorized);
        }
        Ok(())
    }

    fn only_institution_safe(&self, institution_id: U256) -> Result<(), PrimeVaultError> {
        let inst = self.institutions.get(institution_id);
        if msg::sender() != inst.config.safe_wallet.get() {
            return Err(PrimeVaultError::Unauthorized);
        }
        Ok(())
    }

    fn when_not_paused(&self) -> Result<(), PrimeVaultError> {
        if self.paused.get() {
            return Err(PrimeVaultError::Unauthorized);
        }
        Ok(())
    }

    fn calculate_collateral_ratio_post_trade(
        &self,
        institution_id: U256,
        params: &TradeParams,
    ) -> Result<U256, PrimeVaultError> {
        // Simplified calculation
        // Real implementation would calculate new collateral ratio
        // after accounting for trade slippage, fees, etc.
        self.calculate_collateral_ratio(institution_id)
    }

    fn update_position(
        &mut self,
        institution_id: U256,
        asset: Address,
        amount: U256,
        is_increase: bool,
    ) -> Result<(), PrimeVaultError> {
        let mut inst = self.institutions.setter(institution_id);
        let mut pos = inst.positions.setter(asset);

        let current_amount = pos.amount.get();
        let new_amount = if is_increase {
            current_amount + amount
        } else {
            if amount >= current_amount {
                U256::from(0)
            } else {
                current_amount - amount
            }
        };

        pos.asset.set(asset);
        pos.amount.set(new_amount);
        pos.timestamp.set(U256::from(block_timestamp()));

        Ok(())
    }
}

// View struct for returning institution config
pub struct InstitutionConfigView {
    pub institution_id: U256,
    pub safe_wallet: Address,
    pub min_collateral_ratio: U256,
    pub max_position_size: U256,
    pub daily_trade_limit: U256,
    pub grace_period: u64,
    pub is_active: bool,
}

// Helper function to get current block timestamp
fn block_timestamp() -> u64 {
    // This would be replaced with actual block timestamp retrieval
    // For now, using a placeholder
    1700000000
}

#[external]
fn main() {}
