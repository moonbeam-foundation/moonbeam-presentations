const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

// Initialization
const bytecode = compiledFactory.evm.bytecode.object;
const abi = compiledFactory.abi;
const privKey = process.env.PRIV_KEY;
const web3 = new Web3('https://rpc.testnet.moonbeam.network');
const address = web3.eth.accounts.privateKeyToAccount(privKey).address;

// Deploy contract
const deploy = async () => {
   console.log(`Attempting to deploy from account: ${address}`);

   const campaignFactory = new web3.eth.Contract(abi);

   const deployTx = campaignFactory.deploy({
      data: bytecode,
   });

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         data: deployTx.encodeABI(),
         gas: await deployTx.estimateGas(),
      },
      privKey
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(`Contract deployed at address ${createReceipt.contractAddress}`);
};

deploy();
