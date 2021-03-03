// ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// private key from the pre-funded Moonbase Alpha testing account
const { privateKey } = require('../secret-stuff.json');

module.exports = {
   // latest Solidity version
   solidity: '0.8.0',

   networks: {
      // Standalone
      dev: {
         url: `http://127.0.0.1:9933`,
         chainId: 1281,
         accounts: [privateKey],
      },
      // Moonbase Alpha network specification
      moonbase: {
         url: `https://rpc.testnet.moonbeam.network`,
         chainId: 1287,
         accounts: [privateKey],
      },
   },
};
