module.exports = {
   bytecode:
      '608060405234801561001057600080fd5b5060405161016e38038061016e8339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600081905550506101138061005b6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80637cf5dab01460415780638381f58a14606c578063d826f88f146088575b600080fd5b606a60048036036020811015605557600080fd5b81019080803590602001909291905050506090565b005b607260ce565b6040518082815260200191505060405180910390f35b608e60d4565b005b8060005401600081905550600054817f12fae9aa25c3224f14c3c4dca03fc2ba95dced8e8fb3a7df3d77f4d3aeb6273c60405160405180910390a350565b60005481565b6000808190555056fea2646970667358221220c7e28190c4321b0cace9c54b34923dfec67e2f2a894a0ea56898d22b997438c264736f6c63430007060033',
   abi: [
      {
         inputs: [
            {
               internalType: 'uint256',
               name: '_initialNumber',
               type: 'uint256',
            },
         ],
         stateMutability: 'nonpayable',
         type: 'constructor',
      },
      {
         anonymous: false,
         inputs: [
            {
               indexed: true,
               internalType: 'uint256',
               name: 'value',
               type: 'uint256',
            },
            {
               indexed: true,
               internalType: 'uint256',
               name: 'number',
               type: 'uint256',
            },
         ],
         name: 'Increment',
         type: 'event',
      },
      {
         inputs: [
            {
               internalType: 'uint256',
               name: '_value',
               type: 'uint256',
            },
         ],
         name: 'increment',
         outputs: [],
         stateMutability: 'nonpayable',
         type: 'function',
      },
      {
         inputs: [],
         name: 'number',
         outputs: [
            {
               internalType: 'uint256',
               name: '',
               type: 'uint256',
            },
         ],
         stateMutability: 'view',
         type: 'function',
      },
      {
         inputs: [],
         name: 'reset',
         outputs: [],
         stateMutability: 'nonpayable',
         type: 'function',
      },
   ],
};
