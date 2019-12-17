import React, { useState } from "react";
import Headline from "../common/Headline";
import SubmitButton from "../New/SubmitButton";
import { makeProposal } from "../../services/easyDAO";
import Web3 from "web3";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

function DaoFocus({ daoAddress, resetDaoFocus }) {
  const [proposalLink, setProposalLink] = useState("");
  const [proposalAmount, setProposalAmount] = useState("");

  const submitProposal = async (e) => {
    e.preventDefault();
    await makeProposal(daoAddress, proposalLink, proposalAmount);
  };

  const isDisabled = () => {
    if (!proposalLink) return true;
    if (!proposalAmount) return true;
  };

  return (
    <div className="d-flex flex-column mx-auto">
      <div className="position-relative">
        <div className="position-absolute go-back" onClick={resetDaoFocus}>
          Go back
        </div>
      </div>
      <Headline text="DAO Focus" />
      <form className="d-flex flex-column mx-auto">
        <h6>
          Make a Proposal for <code>{daoAddress}</code>
        </h6>
        <input
          value={proposalLink}
          onChange={e => setProposalLink(e.target.value)}
          className="address-input mx-auto px-2 mt-3"
          placeholder="Proposal Link"
        />
        <input
          value={proposalAmount}
          onChange={e => setProposalAmount(e.target.value)}
          className="address-input mx-auto px-2 my-2"
          placeholder="Amount in ETH"
        />
        <SubmitButton onClick={submitProposal} disabled={isDisabled()} />
      </form>
    </div>
  );
}

export default DaoFocus;
