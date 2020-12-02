import React, { Component } from 'react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
   static async getInitialProps(props) {
      const campaign = Campaign(props.query.address);
      const summary = await campaign.methods.getSummary().call();
      return {
         address: props.query.address,
         minimumContribution: summary[0],
         balance: summary[1],
         requestCount: summary[2],
         approversCount: summary[3],
         manager: summary[4],
      };
   }

   renderCards() {
      const {
         balance,
         manager,
         minimumContribution,
         requestCount,
         approversCount,
      } = this.props;

      const items = [
         {
            header: manager,
            meta: 'Address of Manager',
            description:
               'The manager created this campaign and can create requests.',
            style: { overflowWrap: 'break-word' },
         },
         {
            header: web3.utils.fromWei(minimumContribution, 'ether'),
            meta: 'Minimum Contribution (DEV)',
            description:
               'You must contribute at least this much DEV to become an approver.',
         },
         {
            header: requestCount,
            meta: 'Number of Request',
            description:
               'A request tries to withdraw money from the contract. Request must be approved by approvers.',
         },
         {
            header: approversCount,
            meta: 'Number of Approvers',
            description:
               'Number of people who have already donated to this campaign.',
         },
         {
            header: web3.utils.fromWei(balance, 'ether'),
            meta: 'Campaign Balance (DEV)',
            description: 'The balance is how much money this campaign has.',
         },
      ];

      return <Card.Group items={items} />;
   }

   render() {
      return (
         <Layout>
            <h3>Campaign Details</h3>
            <Grid>
               <Grid.Row>
                  <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
                  <Grid.Column width={6}>
                     {/*The address is given by the return from the getInitialProps*/}
                     <ContributeForm address={this.props.address} />
                  </Grid.Column>
               </Grid.Row>

               <Grid.Row>
                  <Grid.Column>
                     <Link route={`/campaigns/${this.props.address}/requests`}>
                        <a>
                           <Button primary>View Request</Button>
                        </a>
                     </Link>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
         </Layout>
      );
   }
}

export default CampaignShow;
