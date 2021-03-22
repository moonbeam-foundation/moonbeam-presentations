const { ethers } = require('hardhat');

// Deploy function
async function deploy() {
   console.log(`----- DEPLOYMENTS -----`);
   [account1] = await ethers.getSigners();

   deployerAddress = account1.address;
   console.log(`Deploying NFT using ${deployerAddress}`);

   //Deploy NFT
   const contract = await ethers.getContractFactory('ERC721Token');
   const contractInstance = await contract.deploy();
   await contractInstance.deployed();
   console.log(`NFT Contract deployed at address: ${contractInstance.address}`);

   //Mint NFT
   const tokenURI = 'NFT Chainlink Hackathon Moonbeam 2021';
   tx = await contractInstance.mintNFT(tokenURI);
   txReceipt = await tx.wait();
   console.log(
      `Token Minted ${deployerAddress} with Tx Hash ${txReceipt.transactionHash}`
   );
}

deploy()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
