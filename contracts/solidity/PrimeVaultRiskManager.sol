// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PrimeVaultRiskManager
 * @notice Risk management module for PrimeVault
 * @dev Handles collateral calculations, position limits, and liquidation logic
 */
contract PrimeVaultRiskManager is Ownable, ReentrancyGuard {
    
    // Risk parameters
    struct RiskParams {
        uint256 minCollateralRatio;      // Minimum collateral ratio (bps)
        uint256 liquidationThreshold;    // Liquidation threshold (bps)
        uint256 liquidationBonus;        // Bonus for liquidators (bps)
        uint256 maxPositionSize;         // Maximum position size
        uint256 dailyTradeLimit;         // Daily trading limit
        uint256 maxDrawdown;             // Maximum drawdown allowed (bps)
    }
    
    // Institution risk data
    struct InstitutionRisk {
        uint256 institutionId;
        uint256 totalCollateral;
        uint256 totalDebt;
        uint256 dailyVolume;
        uint256 lastTradeDay;
        uint256 highWaterMark;
        bool isLiquidatable;
    }
    
    // Position data
    struct Position {
        address asset;
        uint256 amount;
        uint256 entryPrice;
        uint256 entryTime;
        bool isLong;
    }
    
    // State variables
    mapping(uint256 => RiskParams) public institutionRiskParams;
    mapping(uint256 => InstitutionRisk) public institutionRiskData;
    mapping(uint256 => mapping(address => Position[])) public institutionPositions;
    mapping(address => address) public priceFeeds;
    
    address public primeVault;
    address public oracle;
    
    // Constants
    uint256 public constant BPS = 10000;
    uint256 public constant PRICE_PRECISION = 1e8;
    
    // Events
    event RiskParamsUpdated(uint256 indexed institutionId, RiskParams params);
    event PositionOpened(
        uint256 indexed institutionId,
        address indexed asset,
        uint256 amount,
        bool isLong
    );
    event PositionClosed(
        uint256 indexed institutionId,
        address indexed asset,
        uint256 amount,
        uint256 pnl
    );
    event LiquidationStarted(uint256 indexed institutionId, uint256 collateralToSell);
    event PriceFeedSet(address indexed asset, address indexed priceFeed);
    
    modifier onlyPrimeVault() {
        require(msg.sender == primeVault, "Only PrimeVault");
        _;
    }
    
    /**
     * @notice Constructor
     * @param _oracle Chainlink oracle or similar
     */
    constructor(address _oracle) {
        require(_oracle != address(0), "Invalid oracle");
        oracle = _oracle;
    }
    
    /**
     * @notice Set PrimeVault address
     */
    function setPrimeVault(address _primeVault) external onlyOwner {
        primeVault = _primeVault;
    }
    
    /**
     * @notice Set risk parameters for an institution
     */
    function setRiskParams(
        uint256 institutionId,
        RiskParams calldata params
    ) external onlyOwner {
        require(params.minCollateralRatio >= 11000, "Min collateral too low");
        require(params.liquidationThreshold > 10000, "Invalid liquidation threshold");
        require(params.liquidationBonus <= 1000, "Bonus too high");
        
        institutionRiskParams[institutionId] = params;
        emit RiskParamsUpdated(institutionId, params);
    }
    
    /**
     * @notice Set price feed for an asset
     */
    function setPriceFeed(address asset, address priceFeed) external onlyOwner {
        require(asset != address(0) && priceFeed != address(0), "Invalid addresses");
        priceFeeds[asset] = priceFeed;
        emit PriceFeedSet(asset, priceFeed);
    }
    
    /**
     * @notice Validate if a trade can be executed
     */
    function validateTrade(
        uint256 institutionId,
        address asset,
        uint256 amount,
        bool isLong
    ) external view returns (bool, string memory) {
        RiskParams memory params = institutionRiskParams[institutionId];
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        
        // Check position size
        if (amount > params.maxPositionSize) {
            return (false, "Position size exceeds limit");
        }
        
        // Check daily volume
        uint256 currentDay = block.timestamp / 86400;
        uint256 dailyVol = risk.lastTradeDay == currentDay ? risk.dailyVolume : 0;
        
        if (dailyVol + amount > params.dailyTradeLimit) {
            return (false, "Daily trade limit exceeded");
        }
        
        // Check collateral ratio for new position
        uint256 newCollateralRatio = calculateNewCollateralRatio(
            institutionId,
            asset,
            amount,
            isLong
        );
        
        if (newCollateralRatio < params.minCollateralRatio) {
            return (false, "Insufficient collateral");
        }
        
        return (true, "");
    }
    
    /**
     * @notice Calculate collateral ratio after a new position
     */
    function calculateNewCollateralRatio(
        uint256 institutionId,
        address asset,
        uint256 amount,
        bool isLong
    ) public view returns (uint256) {
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        
        if (risk.totalDebt == 0) {
            return BPS * 10; // 1000% if no debt
        }
        
        // Get asset price
        uint256 price = getAssetPrice(asset);
        uint256 positionValue = (amount * price) / PRICE_PRECISION;
        
        uint256 newCollateral = risk.totalCollateral;
        uint256 newDebt = risk.totalDebt;
        
        if (isLong) {
            newCollateral += positionValue;
        } else {
            newDebt += positionValue;
        }
        
        return (newCollateral * BPS) / newDebt;
    }
    
    /**
     * @notice Get current collateral ratio
     */
    function getCollateralRatio(uint256 institutionId) public view returns (uint256) {
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        
        if (risk.totalDebt == 0) {
            return BPS * 10;
        }
        
        return (risk.totalCollateral * BPS) / risk.totalDebt;
    }
    
    /**
     * @notice Check if institution can be liquidated
     */
    function isLiquidatable(uint256 institutionId) external view returns (bool) {
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        RiskParams memory params = institutionRiskParams[institutionId];
        
        uint256 currentRatio = getCollateralRatio(institutionId);
        
        return currentRatio < params.liquidationThreshold;
    }
    
    /**
     * @notice Calculate liquidation amount
     */
    function calculateLiquidationAmount(
        uint256 institutionId
    ) external view returns (uint256) {
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        RiskParams memory params = institutionRiskParams[institutionId];
        
        if (risk.totalDebt == 0) {
            return 0;
        }
        
        uint256 currentRatio = getCollateralRatio(institutionId);
        
        if (currentRatio >= params.liquidationThreshold) {
            return 0;
        }
        
        // Calculate how much collateral to sell to reach minimum ratio
        uint256 targetDebt = (risk.totalCollateral * BPS) / params.minCollateralRatio;
        
        if (targetDebt >= risk.totalDebt) {
            return 0;
        }
        
        uint256 debtToCover = risk.totalDebt - targetDebt;
        
        // Add bonus for liquidator
        return (debtToCover * (BPS + params.liquidationBonus)) / BPS;
    }
    
    /**
     * @notice Record a new position
     */
    function recordPosition(
        uint256 institutionId,
        address asset,
        uint256 amount,
        uint256 entryPrice,
        bool isLong
    ) external onlyPrimeVault {
        Position memory newPosition = Position({
            asset: asset,
            amount: amount,
            entryPrice: entryPrice,
            entryTime: block.timestamp,
            isLong: isLong
        });
        
        institutionPositions[institutionId][asset].push(newPosition);
        
        // Update risk data
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        uint256 positionValue = (amount * entryPrice) / PRICE_PRECISION;
        
        if (isLong) {
            risk.totalCollateral += positionValue;
        } else {
            risk.totalDebt += positionValue;
        }
        
        // Update daily volume
        uint256 currentDay = block.timestamp / 86400;
        if (risk.lastTradeDay != currentDay) {
            risk.dailyVolume = 0;
            risk.lastTradeDay = currentDay;
        }
        risk.dailyVolume += positionValue;
        
        // Update high water mark
        uint256 totalValue = risk.totalCollateral;
        if (totalValue > risk.highWaterMark) {
            risk.highWaterMark = totalValue;
        }
        
        emit PositionOpened(institutionId, asset, amount, isLong);
    }
    
    /**
     * @notice Close a position
     */
    function closePosition(
        uint256 institutionId,
        address asset,
        uint256 positionIndex,
        uint256 exitPrice
    ) external onlyPrimeVault returns (int256 pnl) {
        Position[] storage positions = institutionPositions[institutionId][asset];
        require(positionIndex < positions.length, "Invalid position index");
        
        Position memory pos = positions[positionIndex];
        
        // Calculate PnL
        uint256 exitValue = (pos.amount * exitPrice) / PRICE_PRECISION;
        uint256 entryValue = (pos.amount * pos.entryPrice) / PRICE_PRECISION;
        
        if (pos.isLong) {
            pnl = int256(exitValue) - int256(entryValue);
            institutionRiskData[institutionId].totalCollateral -= entryValue;
        } else {
            pnl = int256(entryValue) - int256(exitValue);
            institutionRiskData[institutionId].totalDebt -= entryValue;
        }
        
        // Remove position (swap with last and pop)
        positions[positionIndex] = positions[positions.length - 1];
        positions.pop();
        
        emit PositionClosed(institutionId, asset, pos.amount, uint256(pnl > 0 ? pnl : 0));
        
        return pnl;
    }
    
    /**
     * @notice Update institution risk data
     */
    function updateRiskData(
        uint256 institutionId,
        uint256 totalCollateral,
        uint256 totalDebt
    ) external onlyPrimeVault {
        InstitutionRisk storage risk = institutionRiskData[institutionId];
        risk.totalCollateral = totalCollateral;
        risk.totalDebt = totalDebt;
        
        // Check if liquidatable
        RiskParams memory params = institutionRiskParams[institutionId];
        uint256 currentRatio = getCollateralRatio(institutionId);
        risk.isLiquidatable = currentRatio < params.liquidationThreshold;
    }
    
    /**
     * @notice Get asset price from Chainlink
     */
    function getAssetPrice(address asset) public view returns (uint256) {
        address priceFeed = priceFeeds[asset];
        require(priceFeed != address(0), "Price feed not found");
        
        // Call Chainlink price feed
        (, int256 price, , uint256 updatedAt, ) = AggregatorV3Interface(priceFeed)
            .latestRoundData();
        
        require(price > 0, "Invalid price");
        require(block.timestamp - updatedAt <= 3600, "Stale price");
        
        return uint256(price);
    }
    
    /**
     * @notice Get institution positions
     */
    function getPositions(
        uint256 institutionId,
        address asset
    ) external view returns (Position[] memory) {
        return institutionPositions[institutionId][asset];
    }
}

// Chainlink interface
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}
