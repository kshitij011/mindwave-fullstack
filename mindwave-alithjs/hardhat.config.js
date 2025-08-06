require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    etherscan: {
        apiKey: process.env.ETHERSCAN_API,
    },
    networks: {
        sepolia: {
            chainId: 11155111,
            url: process.env.PUBLIC_NEXT_ALCHEMY_URL,
            accounts: [process.env.PUBLIC_NEXT_PRIVATE_KEY],
        },
    },
};
