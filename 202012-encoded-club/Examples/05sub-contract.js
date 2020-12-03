const Web3 = require('web3');
const web3 = new Web3('wss://wss.testnet.moonbeam.network');

//event Transfer(address indexed from, address indexed to, uint256 value);
web3.eth
   .subscribe(
      'logs',
      {
         address: '0x8c45C81D0Ac2D357b3230bBfDe0D5588FB7EB964',
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
