import web3 from './web3.js';
const ProxyInterface = require('./abi/ProxyInterface.json');
const ethers = require('ethers');

const ProxyInstace = (address) => {
   return new ethers.Contract(address, ProxyInterface.abi, web3());
};

export default ProxyInstace;
