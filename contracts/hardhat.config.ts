import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'HTTP://127.0.0.1:7545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0xc0ff0b26597b5cd6cbe26a91fcc63ddcfc87f7669363e38dad04194cf2b57723'
      ]
    },
  },
};

export default config;
