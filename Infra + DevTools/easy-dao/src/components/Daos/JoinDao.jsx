import React, { useState } from "react";
import {
  joinDAO,
  EasyDAOContractEthers
} from "../../services/easyDAO";
import { isValidAddress } from "../../utils";
import Loading from "../common/Loading";
import Web3 from "web3";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

function AcceptTrade() {
  const [daoAddress, setDaoAddress] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);

  const join = async e => {
    e.preventDefault();
    toggleTxProcessing(true);

    const contr = await EasyDAOContractEthers(daoAddress);
    contr.on("DAOJoined", (oldValue, newValue, event) => {
      toggleTxProcessing(false); 
      setDaoAddress("");
    });

    await joinDAO(daoAddress);
  };

  const isValid = () => {
    return isValidAddress(daoAddress);
  };

  if (txProcessing) {
    return <Loading />;
  }

  return (
    <div className="mx-auto d-flex flex-column">
      <form className="d-flex my-auto">
        <input
          value={daoAddress}
          onChange={e => setDaoAddress(e.target.value)}
          className="address-input px-2"
          placeholder="DAO Address"
        />
        <button
          className="accept-button ml-2"
          onClick={join}
          disabled={!isValid()}
        >
          Join DAO
        </button>
      </form>
    </div>
  );
}

export default AcceptTrade;
