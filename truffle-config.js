const HDWalletProvider = require("@truffle/hdwallet-provider");

// Moonbeam Development Node Private Key
const privateKeyDev = "0b6e18cafb6ed99687ec547bd28139cafdd2bffe70e6b688025de6b445aa5c5b"; // Charleth
// Moonbase Alpha Private Key --> Please change this to your own Private Key with funds
// NOTE: Do not store your private key in plaintext files
//       this is only for demostration purposes only
const privateKeyMoonbase = "YOUR_PRIVATE_KEY_HERE_ONLY_FOR_DEMOSTRATION_PURPOSES";

module.exports = {
  networks: {
    // Moonbeam Development Network
    dev: {
      provider: () => {
        if (!privateKeyDev.trim()) {
          throw new Error("Please enter a private key with funds, you can use the default one");
        }
        return new HDWalletProvider(
          privateKeyDev,
          "http://localhost:9933/"
        );
      },
      network_id: 1281,
    },
    // Moonbase Alpha TestNet
    moonbase: {
      provider: () => {
        if (!privateKeyMoonbase.trim()) {
          throw new Error("Please enter a private key with funds to send transactions to TestNet");
        }
        if (privateKeyDev == privateKeyMoonbase) {
          throw new Error("Please change the private key used for Moonbase to your own with funds");
        }
        return new HDWalletProvider(privateKeyMoonbase, "https://rpc.testnet.moonbeam.network");
      },
      network_id: 1287,
    },
  },
  // Solidity 0.7.0 Compiler
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
  // Moonbeam Truffle Plugin
  plugins: ["moonbeam-truffle-plugin"],
};
