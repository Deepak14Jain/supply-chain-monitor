// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainMonitor {
    address public owner;
    uint public maxTemperature = 10; 
    bool public isShipmentCompromised; 

    // Events to signal external systems
    event TemperatureReading(uint indexed temp, string message);
    event EmergencyActionTriggered(string action, uint timestamp);

    constructor() {
        owner = msg.sender;
        isShipmentCompromised = false;
    }

    // IoT Sensor calls this
    function reportTemperature(uint _temp) public {
        emit TemperatureReading(_temp, "New reading received");

        if (_temp > maxTemperature && !isShipmentCompromised) {
            emit TemperatureReading(_temp, "CRITICAL");
        }
    }

    // Off-chain listener calls this automatically
    function executeEmergencyProtocol() public {
        require(!isShipmentCompromised, "Action already taken");
        isShipmentCompromised = true;
        emit EmergencyActionTriggered("Shipment Rejected. Protocol Executed.", block.timestamp);
    }
}