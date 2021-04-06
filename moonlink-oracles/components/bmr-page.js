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
         const clientAddress = '0x61b116Bd1ee0706e146816e383014497080937f1';
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
         const clientAddress = '0x61b116Bd1ee0706e146816e383014497080937f1';
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
                        0a1d7df6a47c417bb4d0ab561a37753e
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ETH/USD</td>
                     <td data-label='Job ID'>
                        ddd85cc4bab24920bc7c605b5bed3bf0
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>DOT/USD</td>
                     <td data-label='Job ID'>
                        93790efc1e7641a99465ea8b1c71ce7a
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>KSM/USD</td>
                     <td data-label='Job ID'>
                        d37d9a18f92f49198ceece6d367ed77a
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>AAVE/USD</td>
                     <td data-label='Job ID'>
                        684981fa8e264cc1afa3e1df7fe8eecc
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ALGO/USD</td>
                     <td data-label='Job ID'>
                        f7a442a6365048799a30c02ac56f4440
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>BAND/USD</td>
                     <td data-label='Job ID'>
                        6daa1fe7ba7d421a8a76fa6c2adb1382
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>LINK/USD</td>
                     <td data-label='Job ID'>
                        c1d6b9a159c64d3888b0e71104bdbb8d
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>SUSHI/USD</td>
                     <td data-label='Job ID'>
                        861c8bd8d92f42d3b21606111173cd4a
                     </td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>UNI/USD</td>
                     <td data-label='Price'>
                        14ff274fc6ac469bb3a27b34c21c0957
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}

export default Table;
