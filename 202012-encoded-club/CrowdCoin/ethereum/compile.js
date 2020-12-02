const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Get path to build folder, remove if any
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Read contract file
const campaignPath = path.resolve(__dirname, 'contracts', 'CrowdCoin.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// Prepare input for compiling
const input = {
   language: 'Solidity',
   sources: {
      'Campaign.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};

// Compile and get contracts for output file
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
   'Campaign.sol'
];

// Write output files
fs.ensureDirSync(buildPath);
for (let contract in output) {
   fs.outputJsonSync(
      path.resolve(buildPath, `${contract.replace(':', '')}.json`),
      output[contract]
   );
}
