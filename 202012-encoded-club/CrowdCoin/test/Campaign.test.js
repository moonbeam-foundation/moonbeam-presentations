const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode })
      .send({ from: accounts[0], gas: '1000000' });

   await factory.methods
      .createCampaign(web3.utils.toWei('1', 'ether'))
      .send({ from: accounts[0], gas: '1000000' });

   //Get Campaign address from the factory deployed contract
   [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //Destructuring from array

   campaign = await new web3.eth.Contract(
      JSON.parse(compiledCampaign.interface),
      campaignAddress
   );
});

describe('Campaigns', () => {
   it('deploys a factory and a campaign', () => {
      assert.ok(factory.options.address);
      assert.ok(campaign.options.address);
   });

   it('manager is campaign creator', async () => {
      let manager = await campaign.methods.manager().call();
      assert.equal(accounts[0], manager);
   });

   it('succesfully donate money to campaign', async () => {
      await campaign.methods.contribute().send({
         from: accounts[1],
         value: web3.utils.toWei('1', 'ether'),
         gas: '1000000',
      });

      let approverStatus = await campaign.methods.approvers(accounts[1]).call();
      assert.ok(approverStatus);
   });

   it('did not donated enough to enter', async () => {
      try {
         await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('0.5', 'ether'),
            gas: '1000000',
         });
         assert(false);
      } catch (err) {
         assert(err);
      }
   });

   it('account is not marked as contributor', async () => {
      try {
         let falsyCondition = await campaign.methods
            .approvers(accounts[1])
            .call();
         assert(falsyCondition);
      } catch (err) {
         assert(err);
      }
   });

   it('manager can create payment requets', async () => {
      await campaign.methods
         .createRequest('Batteries supplier', 2, accounts[3])
         .send({
            from: accounts[0],
            gas: '1000000',
         });

      const request = await campaign.methods.requests(0).call();
      assert.ok(request);
      assert.equal('Batteries supplier', request.description);
   });

   it('request can be finalized', async () => {
      //Contribute
      await campaign.methods.contribute().send({
         from: accounts[1],
         value: web3.utils.toWei('5', 'ether'),
         gas: '1000000',
      });

      //Create request
      await campaign.methods
         .createRequest(
            'Batteries supplier',
            web3.utils.toWei('2', 'ether'),
            accounts[3]
         )
         .send({
            from: accounts[0],
            gas: '1000000',
         });

      //Vote to approve request
      await campaign.methods.approveRequest(0).send({
         from: accounts[1],
         gas: '1000000',
      });

      //Get request
      let request = await campaign.methods.requests(0).call();

      //Check that request has a vote registered
      assert.equal(1, request.approvalCount);

      //Get balance from supplier before finalizaton
      let oldBalance = await web3.eth.getBalance(accounts[3]);
      oldBalance = parseFloat(oldBalance);

      //Finalize request
      await campaign.methods.finalizeRequest(0).send({
         from: accounts[0],
         gas: '1000000',
      });

      request = await campaign.methods.requests(0).call();

      //Check that request was finalized
      assert(request.complete);

      //Check that the recipient received the money
      let newBalance = await web3.eth.getBalance(accounts[3]);
      newBalance = parseFloat(newBalance);
      assert(newBalance > oldBalance);
   });
});
