module.exports = {
    bytecode: '608060405234801561001057600080fd5b5060405161021c38038061021c8339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101c18061005b6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80637cf5dab0146100465780638381f58a14610074578063d826f88f14610092575b600080fd5b6100726004803603602081101561005c57600080fd5b810190808035906020019092919050505061009c565b005b61007c6100f4565b6040518082815260200191505060405180910390f35b61009a6100fa565b005b6100b18160005461010390919063ffffffff16565b6000819055506000547f230c08f549f5f9e591e87490c6c26b3715ba3bdbe74477c4ec927b160763f767826040518082815260200191505060405180910390a250565b60005481565b60008081905550565b600080828401905083811015610181576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b809150509291505056fea26469706673582212200d8339826dfbb8fcebae57d84950d545f26541a53f80ef49ebdd5c2aa9b2cbbd64736f6c634300060c0033',
    abi: [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "increment",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_initialNumber",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "number",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "ammount",
                    "type": "uint256"
                }
            ],
            "name": "Incremented",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "reset",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};