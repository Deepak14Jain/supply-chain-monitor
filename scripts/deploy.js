const hre = require("hardhat");

async function main() {
  const monitor = await hre.ethers.deployContract("SupplyChainMonitor");
  await monitor.waitForDeployment();

  console.log("------------------------------------------------");
  console.log("✅ Contract Deployed Successfully!");
  console.log("Address:", monitor.target);
  console.log("------------------------------------------------");
  console.log("PLEASE COPY THIS ADDRESS for the next steps.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});