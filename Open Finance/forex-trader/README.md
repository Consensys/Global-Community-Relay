# ForexTrader

*ForexTrader provides permissionless access to leveraged, p2p forex trading.*

<div padding="100px">
<img src="./src/assets/honeycombwhite.png" width="50%">
</div>


ForexTrader uses the Chainlink/Honeycomb oracle system and the Fixer API to track changes in exchange rates on-chain.

Watch this [demo video](https://www.youtube.com/watch?v=7OARI0ggJVc) to learn more about how to use the platform.

## Initiate a Trade on ForexTrader
* **Navigate to the `New` tab**
* **Select a currency pair and a position and a notional value**
* **Initiate the trade contract and wait for tx to confirm**
* **Select a trade length and deposit the collateral**
* **Copy the trade address on the `Trade` tab and send it to your counterparty**

## Accept a Trade on ForexTrader
* **Receive an address from a potential counterparty**
* **Fund the address with 0.1 LINK if it hasn't yet been funded**
* **Accept the trade and deposit the necessary collateral**

## Repricing a Trade on ForexTrader
* **Copy the trade address into the address input**
* **Fund the address with 0.1 LINK if it hasn't yet been funded**
* **Flip the `Accept Trade` button to `Update Price`**
* **Run the price update**
* **The smart contract will reallocate the collateral between counterparties based on the change in exchange rate**



## Running Locally

There's a live demo linked above, but you can also run the project locally.

* Clone this repo
* `yarn`
* `yarn start`


