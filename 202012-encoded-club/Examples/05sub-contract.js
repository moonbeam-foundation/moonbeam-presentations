const Web3 = require('web3');
const web3 = new Web3('wss://wss.testnet.moonbeam.network');
//const web3 = new Web3('ws://localhost:44444');

web3.eth.subscribe('logs', {
    address: '0x1df797C27012102Cab26a56DE798bC2BcB7b5afa',
    // event Incremented(uint indexed number, uint ammount);
    //keccak256(Incremented(uint256,uint256))
    //topics: ['0x230c08f549f5f9e591e87490c6c26b3715ba3bdbe74477c4ec927b160763f767']
}, (error) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });