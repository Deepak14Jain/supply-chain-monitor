const hre = require("hardhat");
// LOAD ADDRESS AUTOMATICALLY
const { address } = require("../contract_address.json");

async function main() {
  // Use the auto-loaded address
  const monitor = await hre.ethers.getContractAt("SupplyChainMonitor", address);

  console.log("🎧 LISTENER SERVICE STARTED...");
  console.log(`Watching contract at: ${address}`); // Confirming the address
  console.log("Waiting for 'TemperatureReading' events...\n");

  monitor.on("TemperatureReading", async (temp, message) => {
    console.log(`[EVENT RECEIVED] Temp: ${temp}°C | Msg: ${message}`);

    if (message === "CRITICAL") {
      console.log("\n🚨 CRITICAL ALERT DETECTED!");
      console.log("⚡ Triggering Autonomous Emergency Protocol...");
      
      try {
        const tx = await monitor.executeEmergencyProtocol();
        await tx.wait();
        console.log("✅ AUTONOMOUS ACTION EXECUTED: Shipment Rejected.\n");
      } catch (e) {
        console.log("Action failed (maybe already rejected).");
      }
    }
  });
  
  // Keep running
  await new Promise(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});