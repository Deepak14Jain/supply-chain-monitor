const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const monitor = await hre.ethers.deployContract("SupplyChainMonitor");
  await monitor.waitForDeployment();
  const address = monitor.target;

  console.log("------------------------------------------------");
  console.log("✅ Contract Deployed at:", address);
  console.log("------------------------------------------------");

  // --- AUTO-UPDATE CONFIGURATION ---
  
  // 1. Save for the Backend Listener (JSON)
  fs.writeFileSync(
    path.join(__dirname, "../contract_address.json"),
    JSON.stringify({ address: address }, null, 2)
  );

  // 2. Save for the Frontend UI (JS)
  fs.writeFileSync(
    path.join(__dirname, "../env.js"),
    `window.CONTRACT_ADDRESS = "${address}";`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});