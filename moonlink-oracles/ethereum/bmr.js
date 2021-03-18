import web3 from './web3.js';
const BMRInterface = require('./abi/BMRInterface.json');
const ethers = require('ethers');

const BMRInstance = (address, flag) => {
   switch (flag) {
      case 1:
         return new ethers.Contract(
            address,
            BMRInterface.abi,
            web3().getSigner()
         );
      default:
         return new ethers.Contract(address, BMRInterface.abi, web3());
   }
};

export default BMRInstance;
