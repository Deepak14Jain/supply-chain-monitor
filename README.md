# Autonomous Supply Chain Monitor

This project demonstrates an **Event-Driven Autonomous Smart Contract**.

## How it works
1. **Smart Contract:** Holds the state of a shipment.
2. **IoT Simulation:** Sends temperature data to the blockchain.
3. **Autonomous Listener:** An off-chain script listens for the "CRITICAL" event.
4. **Action:** If the temp exceeds 10°C, the listener *automatically* triggers the `executeEmergencyProtocol` function to reject the shipment.

## How to Run
1. `npm install`
2. `npx hardhat run scripts/simulate.js`