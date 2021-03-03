import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Message, Input, Grid } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

class RequestNew extends Component {
   state = {
      value: '',
      description: '',
      recipient: '',
      errorMessage: '',
   };

   static async getInitialProps(props) {
      const { address } = props.query;
      return { address };
   }

   onSubmit = async (event) => {
      event.preventDefault;

      const campaign = Campaign(this.props.address);
      const { description, value, recipient } = this.state;

      // Set the loading tag
      this.setState({ loading: true, errorMessage: '' });
      try {
         const accounts = await web3.eth.getAccounts();
         await campaign.methods
            .createRequest(
               description,
               web3.utils.toWei(value, 'ether'),
               recipient
            )
            .send({ from: accounts[0] });
         Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
      } catch (err) {
         this.setState({ errorMessage: err.message });
      }
      this.setState({ loading: false });
   };

   render() {
      return (
         <Layout>
            <h3>Create a Request:</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
               <Form.Field>
                  <label>Description</label>
                  <Input
                     value={this.state.description}
                     onChange={(event) =>
                        this.setState({ description: event.target.value })
                     }
                  />
               </Form.Field>

               <Form.Field>
                  <label>Value (ether)</label>
                  <Input
                     value={this.state.value}
                     onChange={(event) =>
                        this.setState({ value: event.target.value })
                     }
                  />
               </Form.Field>

               <Form.Field>
                  <label>Recipient</label>
                  <Input
                     value={this.state.recipient}
                     onChange={(event) =>
                        this.setState({ recipient: event.target.value })
                     }
                  />
               </Form.Field>
               <Grid>
                  <Grid.Column width={2}>
                     <Button loading={this.state.loading} type='submit' primary>
                        Create
                     </Button>
                  </Grid.Column>

                  <Grid.Column width={2}>
                     <Link route={`/campaigns/${this.props.address}/requests`}>
                        <a>
                           <Button primary>Back</Button>
                        </a>
                     </Link>
                  </Grid.Column>
               </Grid>

               <Message
                  error
                  header='Oops!'
                  content={this.state.errorMessage}
               />
            </Form>
         </Layout>
      );
   }
}

export default RequestNew;
