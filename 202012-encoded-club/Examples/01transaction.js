const Web3 = require('web3');

// Variables definition
const web3 = new Web3('https://rpc.testnet.moonbeam.network');
const privKey = process.env.PRIV_KEY;
const addressFrom = web3.eth.accounts.privateKeyToAccount(PRIV_KEY);
const addressTo = '0x8841701Dba3639B254D9CEe712E49D188A1e941e';

// Create transaction
const deploy = async () => {
   console.log(
      `Attempting to make transaction from ${addressFrom} to ${addressTo}`
   );

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: addressFrom,
         to: addressTo,
         value: web3.utils.toWei('1', 'ether'),
         gas: 21000,
      },
      privKey
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
