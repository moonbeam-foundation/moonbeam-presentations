import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import BMRInstance from '../ethereum/bmr';
const jobids = require('../ethereum/jobid');

class Table extends Component {
   // Nextjs uses this function to render this first server-side
   static async getInitialProps() {
      getValue();
   }

   state = {
      jobid: '',
      value: 'N/A',
      updated: 'N/A',
      lastJobID: 'N/A',
      loading: false,
      errorMessage: '',
   };

   async componentDidMount() {
      this.getValue();
   }

   componentWillUnmount() {
      clearInterval(this.intervalID);
   }

   onSubmit = async (event) => {
      event.preventDefault();

      this.setState({ loading: true, errorMessage: '' });

      // Check Metamask and Chain ID
      if (
         typeof window.ethereum !== 'undefined' &&
         ethereum.chainId === '0x507'
      ) {
         // Contract info
         const clientAddress = '0x9022ebA265fF80f9e698C416DeF17c55644547fD';
         const contractInstance = BMRInstance(clientAddress, 1);

         // Hack to reset state of contract
         if (this.state.jobid === 'moonlinkreset') {
            try {
               await contractInstance.forceToTrue();
            } catch (err) {
               this.setState({
                  loading: false,
                  errorMessage: err.message,
               });
            }
            this.setState({ loading: false });
            return;
         } else {
            // Check if Job ID is supported
            for (let i in jobids) {
               if (jobids[i] === this.state.jobid) {
                  // Check for ongoing request
                  const check = await contractInstance.fulfillCheck();

                  // Sends the Tx
                  if (check) {
                     try {
                        await contractInstance.requestPrice(this.state.jobid);
                     } catch (err) {
                        this.setState({
                           loading: false,
                           errorMessage: err.message,
                        });
                     }
                  } else {
                     this.setState({
                        loading: false,
                        errorMessage: `Request ${this.state.lastJobID} ongoing. Please wait until it is fulfilled`,
                     });
                  }

                  this.setState({ loading: false });
                  return;
               }
            }

            // Error message because JobId not in the list
            this.setState({
               loading: false,
               errorMessage: 'Job ID not supported',
            });
         }
      } else {
         // Error message because MetaMask not found or Network Id not correct
         this.setState({
            loading: false,
            errorMessage:
               'Please install MetaMask or connect it to Moonbase Alpha',
         });
      }
   };

   getValue = async () => {
      try {
         // Date
         const currentdate = new Date();

         // Contract Fetch
         const clientAddress = '0x9022ebA265fF80f9e698C416DeF17c55644547fD';
         const contractInstance = BMRInstance(clientAddress, 0);
         const value = (await contractInstance.currentPrice()) / 100;

         // Check if value is new to update data
         if (value != this.state.value) {
            // Get Job ID
            const lastJobID = await contractInstance.lastJobId();
            // Get Date
            const lastBlockTime = await contractInstance.lastBlockTime();
            const epoch = new Date(lastBlockTime.toNumber() * 1000);
            const date = `${epoch.getFullYear()}/
            ${('00' + (epoch.getMonth() + 1)).slice(-2)}/
            ${('00' + epoch.getDate()).slice(-2)} -- 
            ${('00' + epoch.getHours()).slice(-2)}:
            ${('00' + epoch.getMinutes()).slice(-2)}:
            ${('00' + epoch.getSeconds()).slice(-2)}`;

            // Update value, time and lastJobID
            this.setState({
               value: value.toString(),
               updated: date,
               lastJobID: lastJobID,
            });
         }

         this.intervalID = setTimeout(this.getValue.bind(this), 5000);
      } catch (error) {
         console.log(error);
      }
   };

   render() {
      return (
         <div>
            <h3>Basic Request Model</h3>
            <p>
               Request a specific price data to an Oracle Node in the Moonbase
               Alpha TestNet. <br /> The value is stored in a contract that is
               displayed in this dashboard.
            </p>
            <h5>
               Current Value: $ {this.state.value} (Last Updated:{' '}
               {this.state.updated} -- JobID: {this.state.lastJobID})
            </h5>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
               <Form.Field>
                  <label>Enter Job ID:</label>
                  <input
                     placeholder='Job ID'
                     value={this.state.jobid}
                     onChange={(event) =>
                        this.setState({ jobid: event.target.value })
                     }
                  />
               </Form.Field>
               <Message
                  error
                  header='Oops!'
                  content={this.state.errorMessage}
               />
               <Button type='submit' loading={this.state.loading} primary>
                  Submit Tx
               </Button>
            </Form>
            <br />
            <table className='ui celled table'>
               <thead>
                  <tr>
                     <th>Token Pair</th>
                     <th>Job ID</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>BTC/USD</td>
                     <td data-label='Job ID'>
                        e129dd6d6a6748fcb7f3944e3993be80
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ETH/USD</td>
                     <td data-label='Job ID'>
                        d27d7e7cb8744c5d87e693c6133c9e82
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>DOT/USD</td>
                     <td data-label='Job ID'>
                        a8ddef6b544e42d194bbf08b7555562a
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>KSM/USD</td>
                     <td data-label='Job ID'>
                        3b586989bdb24a30bfd2ebe87837fdf1
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>AAVE/USD</td>
                     <td data-label='Job ID'>
                        e2519fb0319a4cc09f5c4789f1ffbe13
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ALGO/USD</td>
                     <td data-label='Job ID'>
                        d13eab3969674cda99362a9d015f8d60
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>BAND/USD</td>
                     <td data-label='Job ID'>
                        2e69eb85fd5c4073830b03b463217492
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>LINK/USD</td>
                     <td data-label='Job ID'>
                        c5ba9425089b47c399cc9a1b75942e7f
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>SUSHI/USD</td>
                     <td data-label='Job ID'>
                        253662a033b24f2e963d0631e2c636e6
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>UNI/USD</td>
                     <td data-label='Price'>
                        04fa59eec28244a38988e8e8c1b5fabe
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}

export default Table;
