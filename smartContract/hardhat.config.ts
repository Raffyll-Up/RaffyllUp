import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

// const { PRIVATE_KEY, ETHERSCAN_KEY, SEPOLIA_URL_KEY, LISK_URL_KEY } =
//   process.env;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;
const SEPOLIA_URL_KEY = process.env.SEPOLIA_URL_KEY;
const LISK_URL_KEY = process.env.LISK_URL_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // sepolia: {
    //   url: SEPOLIA_URL_KEY,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
    lisk: {
      url: LISK_URL_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/Ly7PHEoJ2iAwPbFZfVbe5iunN09kSQC-",
      },
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_KEY as string,
      lisk: "123",      
    },
    customChains: [
      {
          network: "lisk",
          chainId: 4202,
          urls: {
              apiURL: "https://sepolia-blockscout.lisk.com/api",
              browserURL: "https://sepolia-blockscout.lisk.com"
          }
      }
    ]
  },  
  sourcify: {
    enabled: false
  },
};

export default config;
