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
         const clientAddress = '0x7B7892B75D31abE50537dcdEcef49F2582F174cE';
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
         const clientAddress = '0x7B7892B75D31abE50537dcdEcef49F2582F174cE';
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
               Current Value: {this.state.value} ( Last Updated:{' '}
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
                        b17d475086e2451f9dee27f506f279c6
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ETH/USD</td>
                     <td data-label='Job ID'>
                        f2376b95145a4511a5ba6720bc8e1e41
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>DOT/USD</td>
                     <td data-label='Job ID'>
                        0cd5311976d94d3e9f97986951ec8ee7
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>KSM/USD</td>
                     <td data-label='Job ID'>
                        8395cde44b584577910d0d46eef00fe7
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>AAVE/USD</td>
                     <td data-label='Job ID'>
                        09a985f987bf4fbb8da269b3d2dbe286
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ALGO/USD</td>
                     <td data-label='Job ID'>
                        8dff957770214c4fb0c79d90f8548754
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>BAND/USD</td>
                     <td data-label='Job ID'>
                        bfbf0761019c493ab448b5a79dc9ba3c
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>LINK/USD</td>
                     <td data-label='Job ID'>
                        1ad3ebb5bbb645b582969071d8a2622b
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>SUSHI/USD</td>
                     <td data-label='Job ID'>
                        a04c1203aae54274b445f352865e9c9a
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>UNI/USD</td>
                     <td data-label='Price'>
                        9be6d53447f84f509d6befb6259d7a72
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}

export default Table;
