const fs = require('fs');

async function main() {
   // Fetch Contract
   const incrementerInstance = await ethers.getContractFactory('Incrementer');
   // Instantiating Contract
   const incrementer = await incrementerInstance.deploy();
   // Wait for Tx Receipt
   await incrementer.deployed();
   console.log(`Deploying Incrementer contract ${incrementer.address}`);

   // Fetch Contract
   const numberInstance = await ethers.getContractFactory('NumberStore');
   // Instantiating Contract
   const number = await numberInstance.deploy(incrementer.address);
   // Wait for Tx Receipt
   await number.deployed();
   console.log(`Deploying NumberStore contract ${number.address}`);

   // Define Address JSON file
   const addresses = {
      incrementer: incrementer.address,
      numberStore: number.address,
   };

   fs.writeFileSync('./addresses.json', JSON.stringify(addresses));
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
