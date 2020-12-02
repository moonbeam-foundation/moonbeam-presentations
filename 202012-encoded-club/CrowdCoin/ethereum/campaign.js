import web3 from './web3';
import Campaign from './build/Campaign.json';

// Create local instance of Campaign
export default (campaignAddress) => {
   return new web3.eth.Contract(Campaign.abi, campaignAddress);
};
