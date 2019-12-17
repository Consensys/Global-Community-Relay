var DAOFactory = artifacts.require("DAOFactory");

module.exports = async function(deployer, network, accounts){
  await deployer.deploy(DAOFactory, {from: accounts[0]});
  const deployedContract = await DAOFactory.deployed();

  console.log('deployed contract', deployedContract.address)
};