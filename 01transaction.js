const Web3 = require('web3');
const { privateKey } = require('./secret-stuff.json');

// Variables definition
const web3 = new Web3('http://127.0.0.1:9933');
//const web3 = new Web3('https://rpc.testnet.moonbeam.network'); //Moonbase Alpha

const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0x44236223aB4291b93EEd10E4B511B37a398DEE55';

// Create transaction
const deploy = async () => {
   console.log(
      `Attempting to make transaction from ${addressFrom} to ${addressTo}`
   );

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         to: addressTo,
         value: web3.utils.toWei('100', 'ether'),
         gas: 21000,
      },
      privateKey
   );

   // Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
};

deploy();
