import React, { Component } from 'react';
import ProxyInstance from '../ethereum/feed';
const addresses = require('../ethereum/addresses');

class Table extends Component {
   // Nextjs uses this function to render this first server-side
   static async getInitialProps() {
      onUpdate();
   }

   // Set Initial State
   state = {
      errorMessage: '',
      btcusd: 'N/A',
      ethusd: 'N/A',
      dotusd: 'N/A',
      ksmusd: 'N/A',
      aaveusd: 'N/A',
      algousd: 'N/A',
      bandusd: 'N/A',
      linkusd: 'N/A',
      sushiusd: 'N/A',
      uniusd: 'N/A',
      btcUpdate: 'N/A',
      ethUpdate: 'N/A',
      dotUpdate: 'N/A',
      ksmUpdate: 'N/A',
      aaveUpdate: 'N/A',
      algoUpdate: 'N/A',
      bandUpdate: 'N/A',
      linkUpdate: 'N/A',
      sushiUpdate: 'N/A',
      uniUpdate: 'N/A',
   };

   async componentDidMount() {
      this.onUpdate();
   }

   componentWillUnmount() {
      clearInterval(this.intervalID);
   }

   onUpdate = async () => {
      // BTC
      const [btcPrice, btcUpdate] = await this.getPriceData(addresses.btcusd);
      // ETH
      const [ethPrice, ethUpdate] = await this.getPriceData(addresses.ethusd);
      // DOT
      const [dotPrice, dotUpdate] = await this.getPriceData(addresses.dotusd);
      // KSM
      const [ksmPrice, ksmUpdate] = await this.getPriceData(addresses.ksmusd);
      // AAVE
      const [aavePrice, aaveUpdate] = await this.getPriceData(
         addresses.aaveusd
      );
      // ALGO
      const [algoPrice, algoUpdate] = await this.getPriceData(
         addresses.algousd
      );
      // BAND
      const [bandPrice, bandUpdate] = await this.getPriceData(
         addresses.bandusd
      );
      // LINK
      const [linkPrice, linkUpdate] = await this.getPriceData(
         addresses.linkusd
      );
      // SUSHI
      const [sushiPrice, sushiUpdate] = await this.getPriceData(
         addresses.sushiusd
      );
      // UNI
      const [uniPrice, uniUpdate] = await this.getPriceData(addresses.uniusd);

      this.setState({
         // Set Price
         btcusd: btcPrice.toFixed(2),
         ethusd: ethPrice.toFixed(2),
         dotusd: dotPrice.toFixed(2),
         ksmusd: ksmPrice.toFixed(2),
         aaveusd: aavePrice.toFixed(2),
         algousd: algoPrice.toFixed(2),
         bandusd: bandPrice.toFixed(2),
         linkusd: linkPrice.toFixed(2),
         sushiusd: sushiPrice.toFixed(2),
         uniusd: uniPrice.toFixed(2),

         // Set Last Updated
         btcUpdate: btcUpdate,
         ethUpdate: ethUpdate,
         dotUpdate: dotUpdate,
         ksmUpdate: ksmUpdate,
         aaveUpdate: aaveUpdate,
         algoUpdate: algoUpdate,
         bandUpdate: bandUpdate,
         linkUpdate: linkUpdate,
         sushiUpdate: sushiUpdate,
         uniUpdate: uniUpdate,
      });

      this.intervalID = setTimeout(this.onUpdate.bind(this), 5000);
   };

   getPriceData = async (address) => {
      // Get price data from proxy contract
      try {
         const contractInstance = ProxyInstance(address);
         const dec = await contractInstance.decimals();
         const info = await contractInstance.latestRoundData();
         const price = info[1] / Math.pow(10, dec);
         const epoch = new Date(info[3].toNumber() * 1000);
         const date = `${epoch.getFullYear()}/
         ${('00' + (epoch.getMonth() + 1)).slice(-2)}/
         ${('00' + epoch.getDate()).slice(-2)} -- 
         ${('00' + epoch.getHours()).slice(-2)}:
         ${('00' + epoch.getMinutes()).slice(-2)}:
         ${('00' + epoch.getSeconds()).slice(-2)}`;

         return [price, date];
      } catch (error) {
         // Could not fetch price return error
         console.log(error);
         return [0, 'N/A'];
      }
   };

   render() {
      return (
         <div>
            <h3>Data Price Feed</h3>
            <p>
               Information displayed in the following table corresponds to
               on-chain price data stored in the Moonbase Alpha TestNet!
            </p>
            <table className='ui celled table'>
               <thead>
                  <tr>
                     <th>Token Pair</th>
                     <th>Price</th>
                     <th>Last Updated</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>BTC / USD</td>
                     <td data-label='Price'>$ {this.state.btcusd}</td>
                     <td data-label='Last Updated'>{this.state.btcUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ETH / USD</td>
                     <td data-label='Price'>$ {this.state.ethusd}</td>
                     <td data-label='Last Updated'>{this.state.ethUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>DOT / USD</td>
                     <td data-label='Price'>$ {this.state.dotusd}</td>
                     <td data-label='Last Updated'>{this.state.dotUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>KSM / USD</td>
                     <td data-label='Price'>$ {this.state.ksmusd}</td>
                     <td data-label='Last Updated'>{this.state.ksmUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>AAVE / USD</td>
                     <td data-label='Price'>$ {this.state.aaveusd}</td>
                     <td data-label='Last Updated'>{this.state.aaveUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>ALGO / USD</td>
                     <td data-label='Price'>$ {this.state.algousd}</td>
                     <td data-label='Last Updated'>{this.state.algoUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>BAND / USD</td>
                     <td data-label='Price'>$ {this.state.bandusd}</td>
                     <td data-label='Last Updated'>{this.state.bandUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>LINK / USD</td>
                     <td data-label='Price'>$ {this.state.linkusd}</td>
                     <td data-label='Last Updated'>{this.state.linkUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>SUSHI / USD</td>
                     <td data-label='Price'>$ {this.state.sushiusd}</td>
                     <td data-label='Last Updated'>{this.state.sushiUpdate}</td>
                  </tr>
               </tbody>
               <tbody>
                  <tr>
                     <td data-label='Token Pair'>UNI / USD</td>
                     <td data-label='Price'>$ {this.state.uniusd}</td>
                     <td data-label='Last Updated'>{this.state.uniUpdate}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}

export default Table;
