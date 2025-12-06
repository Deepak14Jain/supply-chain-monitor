const hre = require("hardhat");

async function main() {
  console.log("--- STARTING SUPPLY CHAIN MONITOR SYSTEM ---");

  // 1. DEPLOY
  const monitor = await hre.ethers.deployContract("SupplyChainMonitor");
  await monitor.waitForDeployment();
  console.log(`Contract deployed to: ${monitor.target}`);

  // 2. ACTIVATE LISTENER ( The "Autonomous" Part )
  console.log("Listener active. Waiting for events...");
  
  monitor.on("TemperatureReading", async (temp, message) => {
    console.log(`[EVENT] Temp: ${temp}°C | Status: ${message}`);

    if (message === "CRITICAL") {
      console.log("\n!!! CRITICAL THRESHOLD BREACHED !!!");
      console.log("Triggering Autonomous Emergency Protocol...");
      
      const tx = await monitor.executeEmergencyProtocol();
      await tx.wait();
      console.log(">>> ACTION COMPLETE: Shipment Rejected on Blockchain. <<<\n");
    }
  });

  // 3. SIMULATE SENSOR DATA
  console.log("\n--- Simulating IoT Sensor Inputs ---");

  // Safe Reading
  console.log("Sensor sending: 8°C...");
  let tx1 = await monitor.reportTemperature(8);
  await tx1.wait();
  await new Promise(r => setTimeout(r, 2000)); // Pause for effect

  // Critical Reading
  console.log("Sensor sending: 12°C...");
  let tx2 = await monitor.reportTemperature(12);
  await tx2.wait();
  
  // Wait for the autonomous logic to finish before closing script
  await new Promise(r => setTimeout(r, 4000));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});