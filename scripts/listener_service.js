const hre = require("hardhat");

// PASTE THE DEPLOYED ADDRESS HERE FROM STEP 1
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

async function main() {
  // Connect to the deployed contract
  const monitor = await hre.ethers.getContractAt("SupplyChainMonitor", CONTRACT_ADDRESS);

  console.log("🎧 LISTENER SERVICE STARTED...");
  console.log(`Watching contract at: ${CONTRACT_ADDRESS}`);
  console.log("Waiting for 'TemperatureReading' events...\n");

  // The Event Listener Logic
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
  
  // Keep the script running
  await new Promise(() => {});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});