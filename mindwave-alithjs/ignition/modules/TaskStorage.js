const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TaskStorageModule", (m) => {
    const TaskStorage = m.contract("TaskStorage");

    return { TaskStorage };
});

// npx hardhat ignition deploy ./ignition/modules/TaskStorage.js --network localhost
// deployed on sepolia: 0x743a55700141A8DE0Fe8593C52d29B5f7570702F
// verified `npx hardhat verify --network sepolia 0x743a55700141A8DE0Fe8593C52d29B5f7570702F`
