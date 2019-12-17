import Web3 from "web3";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

export const isValidAddress = address => {
  return web3.utils.isAddress(address);
};