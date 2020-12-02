import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
   state = {
      minimumContribution: '',
      errorMessage: '',
      loading: false,
   };

   //Form callback, forms try to submit the form to the backend
   onSubmit = async (event) => {
      event.preventDefault();

      // Set the loading tag
      this.setState({ loading: true, errorMessage: '' });
      try {
         const accounts = await web3.eth.getAccounts();
         await factory.methods
            .createCampaign(this.state.minimumContribution)
            .send({ from: accounts[0] });

         Router.pushRoute('/');
      } catch (err) {
         this.setState({ errorMessage: err.message });
      }
      this.setState({ loading: false });
   };

   render() {
      return (
         <Layout>
            <h3>Create a new campaign:</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
               <Form.Field>
                  <label>Minimum Contribution:</label>
                  <Input
                     label='DEV (wei)'
                     labelPosition='right'
                     value={this.state.minimumContribution}
                     onChange={(event) =>
                        this.setState({
                           minimumContribution: event.target.value,
                        })
                     }
                  />
               </Form.Field>

               <Message
                  error
                  header='Oops!'
                  content={this.state.errorMessage}
               />

               <Button loading={this.state.loading} type='submit' primary>
                  Create
               </Button>
            </Form>
         </Layout>
      );
   }
}

export default CampaignNew;
