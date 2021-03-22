const HDWalletProvider = require('@truffle/hdwallet-provider');
const { rinkeby_api } = require('../INFURA_API');
const { privateKey } = require('../secret-stuff.json');

module.exports = {
   networks: {
      moonbase: {
         provider: () => {
            return new HDWalletProvider(
               privateKey,
               'https://rpc.testnet.moonbeam.network'
            );
         },
         network_id: 1287,
         gasPrice: 0,
      },
      rinkeby: {
         provider: () => new HDWalletProvider(privateKey, rinkeby_api),
         network_id: 4,
      },
   },
   // Solidity 0.8.0 Compiler
   compilers: {
      solc: {
         version: '^0.8.0',
      },
   },
};
