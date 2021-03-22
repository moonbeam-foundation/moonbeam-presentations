/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-ethers');

const { rinkeby_api } = require('../INFURA_API');
const { privateKey } = require('../secret-stuff.json');

module.exports = {
   defaultNetwork: 'hardhat',

   networks: {
      hardhat: {},
      rinkeby: {
         url: rinkeby_api,
         accounts: [privateKey],
         chainId: 4,
      },
      moonbase: {
         url: 'https://rpc.testnet.moonbeam.network',
         accounts: [privateKey],
         gasPrice: 0,
         chainId: 1287,
      },
      standalone: {
         url: 'http://127.0.0.1:9937',
         accounts: [privateKey],
         network_id: '1281',
         gasPrice: 0,
         chainId: 1281,
      },
   },
   solidity: {
      compilers: [
         {
            version: '0.8.0',
            settings: {
               optimizer: {
                  enabled: true,
                  runs: 200,
               },
            },
         },
      ],
   },
   paths: {
      sources: './contracts',
      cache: './cache',
      artifacts: './artifacts',
   },
   mocha: {
      timeout: 20000,
   },
};
