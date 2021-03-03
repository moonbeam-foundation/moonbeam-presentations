import web3 from './web3.js';
const CampaignFactory = require('./build/CampaignFactory.json');

// Get address and ABI to deploy a local copy of the contract
const address = '0xF8607d86621757EC6bC9c65199D5F04AD752b555';
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

// Create a local copy of the contract
export default instance;
