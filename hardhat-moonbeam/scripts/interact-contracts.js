const fs = require('fs');

async function main() {
   // Load Addresses
   let addresses = JSON.parse(fs.readFileSync('./addresses.json'));

   // Interact with contract - Fetch Contract
   const numberInstance = await ethers.getContractFactory('NumberStore');
   const number = numberInstance.attach(addresses.numberStore);

   // Fetch Number
   let numStored = await number.numberStored();
   console.log(`Current number stored is ${numStored}`);

   // Increment the Number
   let tx = await number.incrementNumber();
   await tx.wait();

   // Fetch Number
   numStored = await number.numberStored();
   console.log(`Current number stored is ${numStored}`);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
