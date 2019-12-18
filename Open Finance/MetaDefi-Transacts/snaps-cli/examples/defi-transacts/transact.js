/*

var Web3 = require('web3');
const ethers = require('ethers')
const EthereumTx = require('ethereumjs-tx').Transaction


var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/8b8d0c60bfab43bc8725df20fc660d15"));

const privKey = '9b212c0a365be83b4210bc847c96698c1d34a05a93c1c13ca9a4fd901979ea69'
const ethWallet = new ethers.Wallet(privKey, provider);
console.log('My Address');
console.log(ethWallet.address);
const myaddress = ethWallet.address
web3.eth.getTransactionCount('0x412BdE43b0D6487b0f18000F66cE3EdD392Fa9C0', function (err, nonce) {

  var tx = new EthereumTx({
    nonce: nonce,
    gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei')),
    gasLimit: 2100000,
    to: '0xD69Db32D888234B239bC3FFcb2629d9F8e50cfc8'.toLowerCase(),
    value: web3.utils.toHex(web3.utils.toWei('1', 'gwei')),
    data: "0x",
  }, {chain: 'ropsten'});

  tx.sign(Buffer.from(privKey, 'hex'));

  var raw = '0x' + tx.serialize().toString('hex');
  web3.eth.sendSignedTransaction(raw, function (err, transactionHash) {
    console.log(transactionHash);
    console.log(err);
  });
});
const ethers = require('ethers')

let provider = ethers.getDefaultProvider('ropsten');

let privateKey = "9b212c0a365be83b4210bc847c96698c1d34a05a93c1c13ca9a4fd901979ea69"
let wallet = new ethers.Wallet(privateKey, provider);

let balancePromise = wallet.getBalance();

balancePromise.then((balance) => {
  console.log('balacnce');
    console.log(balance);
});

let transactionCountPromise = wallet.getTransactionCount();

transactionCountPromise.then((transactionCount) => {
  console.log('count');
    console.log(parseInt(transactionCount));
  })*/
  async function a() {
    const ethers = require('ethers')


    let provider = ethers.getDefaultProvider('ropsten');
    console.log('Starting invesing function');
    const privKey = '9b212c0a365be83b4210bc847c96698c1d34a05a93c1c13ca9a4fd901979ea69'
    const ethWallet = new ethers.Wallet(privKey, provider);
    const noncea = await ethWallet.getTransactionCount()
    console.log('this is nonce')
    console.log(noncea)
    const transaction = {
      to: '0xD69Db32D888234B239bC3FFcb2629d9F8e50cfc8',
      value: ethers.utils.parseEther("0.1"),
    };
    console.log('prefundEth transaction', transaction)
    console.log('Signing tranasction');
    let tx = await ethWallet.sendTransaction(transaction  )
    console.log('Tx hash is');
    console.log(tx);
    //const signedTransaction = await ethWallet.sign(transaction);
    //console.log('ethersWalletSponsor.sign', signedTransaction)
    //let tx = await provider.sendTransaction(signedTransaction)
    //console.log('ethersWalletSponsor.sendTransaction', tx, 'ethersWallet.getBalance()', await ethWallet.getBalance())
    //

  }

  a()
