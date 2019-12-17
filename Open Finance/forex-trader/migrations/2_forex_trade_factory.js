var ForexTradeFactory = artifacts.require("ForexTradeFactory");

// const ROPSTEN_LINK_TOKEN_ADDRESS = "0x20fE562d797A42Dcb3399062AE9546cd06f63280"
// const ORACLE_ADDRESS = "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721"

const jobId = web3.utils.toHex('920fc1321dc441c68975aff18e30340c'); //fixer /latest, int, ropsten

module.exports = async function(deployer, network, accounts){
  await deployer.deploy(ForexTradeFactory, jobId, {from: accounts[0]});
  const deployedContract = await ForexTradeFactory.deployed();

  console.log('deployed contract', deployedContract.address)
};