# ![moonbeam](https://github.com/PureStake/moonbeam/blob/master/media/moonbeam-cover.jpg)

# Web3.js Examples on Moonbeam

These examples provide different usecases for the web3.js library on Moonbeam. The examples include the following:

- [Sending a Transaction](#sending-a-transaction)
 - Deploy a smart contract
 - Subscribe to logs regarding pending transactions
 - Subscribe to logs regarding new block headers
 - Subscribe to logs regarding events emmited by smart contracts

The following URLs provide useful information to get started with the Moonbase Alpha TestNet:

 - [The Moonbase Alpha TestNet](https://docs.moonbeam.network/networks/testnet/)
 - [Web3.js on Moonbeam](https://docs.moonbeam.network/integrations/jslibraries/web3js/)
 - [Tutorial on sending a transaction](https://docs.moonbeam.network/getting-started/local-node/web3-js/web3-transaction/)
 - [Tutorial on deploying a contract](https://docs.moonbeam.network/getting-started/local-node/web3-js/web3-transaction/)
 - [Subscription to events](https://docs.moonbeam.network/integrations/pubsub/)

More information can be found in our [documentation site](https://docs.moonbeam.network/). The only requirement for this guide is to install the `web3.js` package. To do so, you can run:

```
npm install web3
```

The package is included as a dependency inside the "Examples" folder, thus you can also run:

```
npm install
```

Also, for the transaction and contract deployment files, the private key is stored as an environment variable. To do this, run the following code: 

```
export PRIV_KEY="your-private-key-here"
```

Now you have your private key available to use at `process.env.PRIV_KEY`.



