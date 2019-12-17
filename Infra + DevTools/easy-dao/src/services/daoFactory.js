import Web3 from "web3";
import { ethers } from "ethers";
import DAOFactory from "../contracts/DAOFactory.json";
// import ForexTrade from "../contracts/ForexTrade.json";


let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

export const DAO_FACTORY_ADDRESS =
  "0x99AF0A65d33E95A9D12aec5B7074d08C6884B45D"; // ropsten

/* DAOFactory Contract */
export async function DAOFactoryContract() {
  return await new web3.eth.Contract(
    DAOFactory.abi,
    DAO_FACTORY_ADDRESS
  );
}

export async function DAOFactoryContractEthers() {
  let provider = ethers.getDefaultProvider("ropsten");
  let contract = new ethers.Contract(
    DAO_FACTORY_ADDRESS,
    DAOFactory.abi,
    provider
  );
  return contract;
}

export async function createDAO(daoType, entryFeeInEth, votingPeriod) {
  const contr = await DAOFactoryContract();

  const entryFeeWei = web3.utils.toWei(entryFeeInEth, "ether");
  const votingPeriodSeconds = Number(votingPeriod) * 60 * 60;
  console.log(votingPeriodSeconds)
  await contr.methods.createDAO(daoType, entryFeeWei, votingPeriodSeconds).send({
    from: web3.eth.accounts.givenProvider.selectedAddress,
    value: entryFeeWei
  });
}

export async function getDAOsByAddress(address) {
  const contr = await DAOFactoryContract();
  const resp = await contr.methods.getUserDAOs(address).call();
  return resp;
}

export async function getUsersByDAO(address) {
  const contr = await DAOFactoryContract();
  const resp = await contr.methods.getDAOUsers(address).call();
  return resp;
}