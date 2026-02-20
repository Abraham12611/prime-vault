const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Arbitrum Sepolia addresses (update with real addresses when available)
const ARBITRUM_SEPOLIA = {
  SAFE_SINGLETON: "0x...", // Safe singleton address
  SAFE_PROXY_FACTORY: "0x...", // Safe proxy factory
  FALLBACK_HANDLER: "0x...", // CompatibilityFallbackHandler
  CHAINLINK_ETH_USD: "0xd30e2101a97dcbAeBCBC04F14C3f624E67A87965", // ETH/USD price feed
  CHAINLINK_USDC_USD: "0x...", // USDC/USD price feed
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Network:", network.name);

  // 1. Deploy PrimeVaultRiskManager
  console.log("\n1. Deploying PrimeVaultRiskManager...");
  const RiskManager = await ethers.getContractFactory("PrimeVaultRiskManager");
  const riskManager = await RiskManager.deploy(
    ARBITRUM_SEPOLIA.CHAINLINK_ETH_USD // Oracle address
  );
  await riskManager.waitForDeployment();
  console.log("✓ PrimeVaultRiskManager deployed to:", await riskManager.getAddress());

  // 2. Deploy PrimeVaultSafeFactory
  console.log("\n2. Deploying PrimeVaultSafeFactory...");
  const SafeFactory = await ethers.getContractFactory("PrimeVaultSafeFactory");
  const safeFactory = await SafeFactory.deploy(
    ARBITRUM_SEPOLIA.SAFE_SINGLETON,
    ARBITRUM_SEPOLIA.SAFE_PROXY_FACTORY,
    ARBITRUM_SEPOLIA.FALLBACK_HANDLER
  );
  await safeFactory.waitForDeployment();
  console.log("✓ PrimeVaultSafeFactory deployed to:", await safeFactory.getAddress());

  // 3. Set up price feeds
  console.log("\n3. Setting up price feeds...");
  await (await riskManager.setPriceFeed(
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH
    ARBITRUM_SEPOLIA.CHAINLINK_ETH_USD
  )).wait();
  console.log("✓ WETH price feed set");

  // 4. Save deployment info
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      PrimeVaultRiskManager: await riskManager.getAddress(),
      PrimeVaultSafeFactory: await safeFactory.getAddress(),
    },
  };

  const deploymentPath = path.join(__dirname, "..", "deployments", `${network.name}.json`);
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✓ Deployment info saved to:", deploymentPath);

  // 5. Verify contracts on Arbiscan (if not local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n4. Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    console.log("Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: await riskManager.getAddress(),
        constructorArguments: [ARBITRUM_SEPOLIA.CHAINLINK_ETH_USD],
      });
      console.log("✓ RiskManager verified");
    } catch (e) {
      console.log("RiskManager verification failed:", e.message);
    }

    try {
      await hre.run("verify:verify", {
        address: await safeFactory.getAddress(),
        constructorArguments: [
          ARBITRUM_SEPOLIA.SAFE_SINGLETON,
          ARBITRUM_SEPOLIA.SAFE_PROXY_FACTORY,
          ARBITRUM_SEPOLIA.FALLBACK_HANDLER,
        ],
      });
      console.log("✓ SafeFactory verified");
    } catch (e) {
      console.log("SafeFactory verification failed:", e.message);
    }
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Deploy Stylus contract using 'cargo stylus deploy'");
  console.log("2. Set PrimeVault address in SafeFactory");
  console.log("3. Set PrimeVault address in RiskManager");
  console.log("4. Approve protocols for trading");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
