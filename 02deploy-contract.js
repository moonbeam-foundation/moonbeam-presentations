const ethers = require('ethers');
const contractFile = require('./contract-stuff');
const { privateKey } = require('./secret-stuff.json');

// Initialization
const bytecode = contractFile.bytecode;
const abi = contractFile.abi;
const providerURL = 'http://127.0.0.1:9933';
//const providerURL = 'https://rpc.testnet.moonbeam.network'; //Moonbase Alpha

// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);
// Create Wallet
let wallet = new ethers.Wallet(privateKey, provider);

// Deploy contract
const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);
const deploy = async () => {
   console.log(`Attempting to deploy from account: ${wallet.address}`);

   // Deploy contract with initialNumber set to 5
   const contract = await incrementer.deploy([5]);
   await contract.deployed();

   console.log(`Contract deployed at address ${contract.address}`);
};

deploy();
