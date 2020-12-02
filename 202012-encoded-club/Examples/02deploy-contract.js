const Web3 = require('web3');
const { bytecode, abi } = require('./contract-stuff');

// Initialization
const web3 = new Web3('https://rpc.testnet.moonbeam.network');
const privKey = process.env.PRIV_KEY;
const address = web3.eth.accounts.privateKeyToAccount(PRIV_KEY);

// Deploy contract
const deploy = async () => {
   console.log('Attempting to deploy from account:', address);

   const incrementer = new web3.eth.Contract(abi);

   const incrementerTx = incrementer.deploy({
      data: bytecode,
      arguments: [5],
   });

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         data: incrementerTx.encodeABI(),
         gas: '1000000',
      },
      privKey
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log('Contract deployed at address', createReceipt.contractAddress);
};

deploy();
