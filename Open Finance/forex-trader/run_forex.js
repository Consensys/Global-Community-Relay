const chainlinkHelpers = require("chainlink-test-helpers");

const ForexTrade = artifacts.require("ForexTrade");
const ForexTradeFactory = artifacts.require("ForexTradeFactory");
const LinkToken = artifacts.require("LinkToken.sol");

const myContractAddress = '0x09C8C9a3e98473624eD042d75Fb5f8b3E96198D5'; // ropsten forextradefactory 

module.exports = async function () {
    // We will only check events after this point
    const lastBlock = await web3.eth.getBlock('latest');

    const myContract = await ForexTradeFactory.deployed();
    console.log('Factory address: ' + myContract.address);

    tx = await myContract.createTrade("USD", "EUR");
    console.log('Created trade', tx);

    const tradesByAddress = await myContract

}


const base = "USD" // base
const symbols = "GBP,JPY,EUR"
const copyPath =  'rates.EUR' // 
const times = 1000;

module.exports = async function () {
    // We will only check events after this point
    const lastBlock = await web3.eth.getBlock('latest');

    const myContract = await ForexTrader.deployed();
    // const myContract = await ForexTrader.at(myContractAddress);
    console.log('Requester: ' + myContract.address);

    const linkTokenContract = await LinkToken.at(linkTokenAddress);
    console.log('LINK token: ' + linkTokenContract.address);

    // Send the contract 0.1 LINK for it to send it to the oracle
    await linkTokenContract.transfer(myContract.address, web3.utils.toWei('0.1', 'ether'));
    console.log('Sent 0.1 LINK to the requester');

    tx = await myContract.createRequest(jobId, base, symbols, copyPath, times);
    console.log('Created request');
    request = chainlinkHelpers.decodeRunRequest(tx.receipt.rawLogs[3]);
    console.log(request);

    // Wait until you get a ChainlinkFulfilled event with the same requestId
    while (true) {
        breakFlag = false;

        const fulfilledEvents = await myContract.getPastEvents('ChainlinkFulfilled', { fromBlock: lastBlock.number, toBlock: 'latest' });

        for (fulfilledEvent of fulfilledEvents) {
            if (request.id === fulfilledEvent.returnValues.id) {
                console.log(fulfilledEvent);
                breakFlag = true;
                break;
            }
        }
        if (breakFlag) {
            break;
        }
        await new Promise(done => setTimeout(done, 5000)); // 5 second delay
        console.log('...');
    }
    console.log('Request fulfilled');

    const returnedData = await myContract.data();
    console.log('eur-rates unparsed', returnedData)
    console.log('eur rates', parseFloat(returnedData.toString()) / times);
}

