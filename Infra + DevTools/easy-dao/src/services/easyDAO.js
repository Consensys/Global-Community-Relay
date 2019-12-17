import Web3 from "web3";
import { ethers } from "ethers";
import EasyDAO from "../contracts/EasyDAO.json";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}


/* EasyDAO Contract */
async function EasyDAOContract(address) {
  return await new web3.eth.Contract(EasyDAO.abi, address);
}

export async function EasyDAOContractEthers(address) {
  let provider = ethers.getDefaultProvider("ropsten");
  let contract = new ethers.Contract(address, EasyDAO.abi, provider);
  return contract;
}

export async function joinDAO(address) {
  const contr = await EasyDAOContract(address);
  const dao = await getDAO(address);
  const value = dao["_entryFee"];

  await contr.methods.join().send({
    from: web3.eth.accounts.givenProvider.selectedAddress,
    value 
  })
}

export async function makeProposal(address, proposalUrl, amountInEth){
  const contr = await EasyDAOContract(address);
  const amount = web3.utils.toWei(amountInEth, "ether");

  await contr.methods.makeProposal(proposalUrl, amount).send({
    from: web3.eth.accounts.givenProvider.selectedAddress
  })
}

export async function getProposal(address, proposalId){
  const contr = await EasyDAOContract(address);

  const proposal = await contr.methods.getProposal(proposalId).call();
  console.log('proposal', proposal)
  return proposal;
}

// vote: 0 for no, 1 for yes
export async function voteOnProposal(address, proposalId, vote){
  const contr = await EasyDAOContract(address);

  await contr.methods.voteOnProposal(proposalId, vote).send({
    from: web3.eth.accounts.givenProvider.selectedAddress
  })
}

export async function getDAO(address) {
  const contr = await EasyDAOContract(address);
  const dao = await contr.methods.getDAO().call();
  return dao;
}
