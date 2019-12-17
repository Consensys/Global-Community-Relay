import React from "react";
import Web3 from "web3";
import {
  createDAO,
  getDAOsByAddress,
  getUsersByDAO
} from "./services/daoFactory";
import { makeProposal, joinDAO, getProposal, voteOnProposal } from "./services/easyDAO";
import Home from "./components/Home";
import TopNav from "./components/TopNav";
import "./App.css";


let web3;

if(window.ethereum){
    web3 = new Web3(window.ethereum);
}
const daoAddress = "0x2045a20202816802C56610bbcFed2e0b4267aA1E"; // example

const votingPeriod = 60 * 60 * 6; // 6 hours
const entryFee = "0.1"; // eth
const proposalUrl = "https://docs.google.com/document/d/1ykLyt0GsQD-QoGeethqSZLK_1F-DT6jF2_VtZ-8L1HM/edit"
// const notional = 0.1; //eth

function App() {
  return (
    <div className="App d-flex flex-column">
      <TopNav />
      <Home />
      {/* <button onClick={() => createDAO(entryFee, votingPeriod)}>create dao</button>
      
      <button onClick={() => getDAOsByAddress(web3.eth.accounts.givenProvider.selectedAddress)}>  
        get daos by address
      </button>
      <button onClick={() => joinDAO(daoAddress)}>  
        join dao
      </button>
      <button onClick={() => getUsersByDAO(daoAddress)}>  
        see dao's users
      </button>
      <button onClick={() => makeProposal(daoAddress, proposalUrl, "0.1")}>  
        make proposal
      </button>
      <button onClick={() => getProposal(daoAddress, 1)}>  
        get proposal
      </button>
      <button onClick={() => voteOnProposal(daoAddress, 1, 1)}>  
        vote on proposal
      </button> */}

      {/* <button onClick={window.ethereum.enable}>
        Enable Web3
      </button> */}
    </div>
  );
}

export default App;
