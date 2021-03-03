const Web3 = require('web3');
const web3 = new Web3('wss://wss.testnet.moonbeam.network'); //Only change for Moonbeam

web3.eth
   .subscribe(
      'logs',
      {
         address: '0x8c45C81D0Ac2D357b3230bBfDe0D5588FB7EB964',
         // event Increment(uint256 indexed value, uint256 number);
         //keccak256(Increment(uint256,uint256))
         //topics: ['0x12fae9aa25c3224f14c3c4dca03fc2ba95dced8e8fb3a7df3d77f4d3aeb6273c']
      },
      (error) => {
         if (error) console.error(error);
      }
   )
   .on('connected', function (subscriptionId) {
      console.log(subscriptionId);
   })
   .on('data', function (log) {
      console.log(log);
   });
