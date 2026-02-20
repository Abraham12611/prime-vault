// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@safe-global/safe-contracts/contracts/Safe.sol";
import "@safe-global/safe-contracts/contracts/proxies/SafeProxyFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PrimeVaultSafeFactory
 * @notice Factory for creating Safe smart accounts for institutions
 * @dev Integrates with Safe contracts and PrimeVault Stylus contract
 */
contract PrimeVaultSafeFactory is Ownable, ReentrancyGuard {
    
    // Safe contract addresses
    address public immutable safeSingleton;
    address public immutable safeProxyFactory;
    address public immutable fallbackHandler;
    
    // PrimeVault Stylus contract
    address public primeVault;
    
    // Institution tracking
    mapping(uint256 => address) public institutionSafes;
    mapping(address => uint256) public safeToInstitution;
    uint256 public institutionCounter;
    
    // Events
    event SafeCreated(
        uint256 indexed institutionId,
        address indexed safe,
        address[] owners,
        uint256 threshold
    );
    
    event PrimeVaultSet(address indexed primeVault);
    
    /**
     * @notice Constructor
     * @param _safeSingleton Safe master copy address
     * @param _safeProxyFactory Safe proxy factory address
     * @param _fallbackHandler Compatibility fallback handler
     */
    constructor(
        address _safeSingleton,
        address _safeProxyFactory,
        address _fallbackHandler
    ) {
        require(_safeSingleton != address(0), "Invalid singleton");
        require(_safeProxyFactory != address(0), "Invalid factory");
        require(_fallbackHandler != address(0), "Invalid handler");
        
        safeSingleton = _safeSingleton;
        safeProxyFactory = _safeProxyFactory;
        fallbackHandler = _fallbackHandler;
    }
    
    /**
     * @notice Set PrimeVault contract address
     * @param _primeVault Address of PrimeVault Stylus contract
     */
    function setPrimeVault(address _primeVault) external onlyOwner {
        require(_primeVault != address(0), "Invalid address");
        primeVault = _primeVault;
        emit PrimeVaultSet(_primeVault);
    }
    
    /**
     * @notice Create a new Safe for an institution
     * @param owners Array of owner addresses
     * @param threshold Number of signatures required
     * @param minCollateralRatio Minimum collateral ratio (basis points)
     * @param maxPositionSize Maximum position size
     * @param dailyTradeLimit Daily trade limit
     * @param gracePeriod Liquidation grace period in seconds
     * @return institutionId ID of the created institution
     * @return safeAddress Address of the created Safe
     */
    function createInstitutionSafe(
        address[] calldata owners,
        uint256 threshold,
        uint256 minCollateralRatio,
        uint256 maxPositionSize,
        uint256 dailyTradeLimit,
        uint256 gracePeriod
    ) external nonReentrant returns (uint256 institutionId, address safeAddress) {
        require(owners.length >= threshold, "Threshold too high");
        require(threshold >= 2, "Threshold must be >= 2");
        require(owners.length <= 10, "Too many owners");
        
        institutionCounter++;
        institutionId = institutionCounter;
        
        // Encode Safe setup data
        bytes memory setupData = abi.encodeWithSelector(
            Safe.setup.selector,
            owners,
            threshold,
            address(0), // to
            "", // data
            fallbackHandler,
            address(0), // paymentToken
            0, // payment
            address(0) // paymentReceiver
        );
        
        // Create Safe proxy
        safeAddress = SafeProxyFactory(safeProxyFactory).createProxyWithNonce(
            safeSingleton,
            setupData,
            institutionId // salt nonce
        );
        
        // Track institution
        institutionSafes[institutionId] = safeAddress;
        safeToInstitution[safeAddress] = institutionId;
        
        // Register in PrimeVault if set
        if (primeVault != address(0)) {
            // Call PrimeVault.register_institution
            (bool success, ) = primeVault.call(
                abi.encodeWithSignature(
                    "register_institution(address,uint256,uint256,uint256,uint64)",
                    safeAddress,
                    minCollateralRatio,
                    maxPositionSize,
                    dailyTradeLimit,
                    gracePeriod
                )
            );
            require(success, "PrimeVault registration failed");
        }
        
        emit SafeCreated(institutionId, safeAddress, owners, threshold);
        
        return (institutionId, safeAddress);
    }
    
    /**
     * @notice Get Safe address for institution
     * @param institutionId Institution ID
     * @return Safe address
     */
    function getSafeAddress(uint256 institutionId) external view returns (address) {
        return institutionSafes[institutionId];
    }
    
    /**
     * @notice Get institution ID for Safe
     * @param safe Safe address
     * @return Institution ID
     */
    function getInstitutionId(address safe) external view returns (uint256) {
        return safeToInstitution[safe];
    }
}
