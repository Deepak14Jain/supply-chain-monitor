const hre = require("hardhat");

// PASTE THE DEPLOYED ADDRESS HERE FROM STEP 1
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const monitor = await hre.ethers.getContractAt("SupplyChainMonitor", CONTRACT_ADDRESS);

  // Get temperature from command line argument, default to 12
  const temp = process.env.TEMP || 12; 

  console.log(`📤 SENSOR SERVICE: Reporting temperature of ${temp}°C...`);
  
  const tx = await monitor.reportTemperature(temp);
  await tx.wait();
  
  console.log("✅ Data sent to blockchain.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});