import React, { Component } from 'react';
import web3 from '../ethereum/web3';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class ContributeForm extends Component {
   state = {
      contribution: '',
      errorMessage: '',
   };

   onSubmit = async (event) => {
      event.preventDefault();

      const campaign = Campaign(this.props.address);

      // Set the loading tag
      this.setState({ loading: true, errorMessage: '' });
      try {
         const accounts = await web3.eth.getAccounts();
         await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.contribution, 'ether'),
         });
      } catch (err) {
         this.setState({ errorMessage: err.message });
      }
      this.setState({ loading: false });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
   };

   render() {
      return (
         <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
               <label>Amount to Contribute</label>
               <Input
                  label='DEV'
                  labelPosition='right'
                  value={this.state.contribution}
                  onChange={(event) =>
                     this.setState({
                        contribution: event.target.value,
                     })
                  }
               />
            </Form.Field>

            <Message error header='Oops!' content={this.state.errorMessage} />

            <Button loading={this.state.loading} type='submit' primary>
               Contribute
            </Button>
         </Form>
      );
   }
}

export default ContributeForm;
