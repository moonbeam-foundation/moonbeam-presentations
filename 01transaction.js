const ethers = require('ethers');
const { privateKey } = require('./secret-stuff.json');

// Variables definition
const privKey = privateKey;
const addressTo = '0x8841701Dba3639B254D9CEe712E49D188A1e941e';
const providerURL = 'https://rpc.testnet.moonbeam.network'; //Only change for Moonbeam
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);
// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);

// Deploy Transaction
const send = async () => {
   console.log(
      `Attempting to send transaction from ${wallet.address} to ${addressTo}`
   );

   // Create Tx Object
   const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('1'),
   };

   const createReceipt = await wallet.sendTransaction(tx);
   await createReceipt.wait();
   console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

send();
