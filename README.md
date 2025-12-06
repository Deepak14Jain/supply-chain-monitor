# Autonomous Supply Chain Monitor

## Project Overview
This project implements an **Event-Driven Autonomous Smart Contract** designed for supply chain quality assurance. It demonstrates how off-chain systems can listen to blockchain events and autonomously trigger state changes without human intervention.

**The Scenario:**
A shipment of temperature-sensitive goods (e.g., vaccines) is being tracked on the Ethereum blockchain.
1.  **Event:** IoT sensors report temperature data to the contract.
2.  **Trigger:** If the temperature exceeds the critical threshold (10°C), the contract emits a specific event.
3.  **Autonomous Action:** An off-chain "Listener Service" detects this event and immediately executes an emergency protocol to reject the shipment.

**Data Flow Diagram:**
```text
[Sensor/UI] --(1. Report Temp)--> [Smart Contract] 
                                        |
                                  (2. Emit Event)
                                        v
                                [Listener Service]
                                        |
                               (3. Detect 'CRITICAL')
                                        |
[Smart Contract] <--(4. Exec Protocol)--+
       |
(5. State Updated: REJECTED)
```

---

## System Architecture
The system follows a **Decoupled Microservice Architecture** to demonstrate real-world integration.



#### 1. The Smart Contract (On-Chain)
* **Role:** Acts as the immutable "State Machine".
* **Key Logic:** It does not constantly check the temperature. Instead, it relies on being "poked" by the sensor and emitting events for the outside world.
* **Autonomous Enforcement:** Once the `isShipmentCompromised` flag is set to true, the shipment is permanently rejected.

#### 2. The Listener Service (Off-Chain / The "Bot")
* **Role:** The "Brain" of the autonomous logic.
* **Tech:** Node.js + Ethers.js.
* **Logic:** It subscribes to the `TemperatureReading` event. It filters logs in real-time. If it sees a "CRITICAL" message, it signs a transaction to call `executeEmergencyProtocol()`.

#### 3. The IoT Sensor (Off-Chain / The Trigger)
* **Role:** Simulates a physical device sending data.
* **Tech:** Node.js script connecting to the JSON-RPC provider.

---

## Tech Stack
* **Blockchain:** Hardhat (Localhost)
* **Smart Contract:** Solidity (v0.8.19)
* **Backend:** Node.js, Ethers.js
* **Frontend:** HTML5, CSS3, Ethers.js (Web Dashboard)
* **Containerization:** Docker

---

## Project Structure
```text
supply-chain-monitor/
├── contracts/
│   └── SupplyChainMonitor.sol    # The Autonomous Smart Contract
├── scripts/
│   ├── deploy.js                 # Deploys contract & generates config files
│   ├── listener_service.js       # The "Bot" that listens for events
│   ├── sensor_trigger.js         # Simulates IoT data input
│   └── simulate_system.js        # Standalone script (Single-run simulation)
├── Dockerfile                    # For containerized deployment
├── index.html                    # Frontend Dashboard
├── package.json                  # Dependencies & Scripts
└── README.md                     # Documentation
```

---

## How to Run

#### 1. Prerequisites
* **Node.js** (v16 or higher)
* **Git**

#### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Deepak14Jain/supply-chain-monitor.git
cd supply-chain-monitor
npm install
```

#### 3. Execution
**Execution Method A: The "Master Script" (Recommended)**
This command orchestrates the entire stack (Blockchain + Listener + UI) in one terminal.
```bash
npm start
```
What happens:
- Starts a local Hardhat Blockchain.
- Deploys the Smart Contract.
- Starts the Autonomous Listener.
- Launches the Web Dashboard at http://127.0.0.1:8080.

**Execution Method B: Docker**
If you prefer containerization, you can run the full stack without installing Node.js locally.
```bash
# 1. Build the image
docker build -t supply-chain-monitor .

# 2. Run the container (Mapping ports 8545 and 8080)
docker run -p 8545:8545 -p 8080:8080 supply-chain-monitor
```
Access the dashboard at `http://localhost:8080`.

**Execution Method C: Manual (Step-by-Step)**
Use this method for debugging or to see logs in separate terminals.
```bash
# Terminal 1: Start Blockchain
npm run node
```
```bash
# Terminal 2: Deploy & Start Listener
npm run deploy
npm run listener
```
```bash
# Terminal 3: Trigger Events (Simulate IoT) You can trigger events via the UI or using this CLI

# Send Safe Temperature (8°C)
TEMP=8 npx hardhat run scripts/sensor_trigger.js --network localhost

# Send Critical Temperature (12°C) -> Triggers Autonomous Action
TEMP=12 npx hardhat run scripts/sensor_trigger.js --network localhost
```

---

## Issues & Troubleshooting
If the Autonomous Listener does not trigger the action as expected, please check the following:

1.  **Block Number Sync:** Ensure your browser logs show incrementing block numbers (e.g., `[eth_blockNumber]`). If not, your UI is disconnected.
2.  **Contract Mismatch:** If you restarted `npm run node`, you **must** run `npm run deploy` again to update the contract address.

### How to Report a Bug
If you encounter a persistent error:
1.  Navigate to the **Issues** tab in this repository.
2.  Click **New Issue**.
3.  Include a screenshot of your **Terminal 2** (Listener Service) logs.
4.  Describe the steps to reproduce the issue (e.g., *"I sent 12°C but the status stayed Green"*).