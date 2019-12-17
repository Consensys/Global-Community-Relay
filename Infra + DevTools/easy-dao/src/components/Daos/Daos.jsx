import React, { useState, useEffect } from "react";
import Headline from "../common/Headline";
import Loading from "../common/Loading";
import JoinDAO from "./JoinDao";
import DaoTable from "./DaoTable";
import Web3 from "web3";
import { getDAOsByAddress } from "../../services/daoFactory";
import DaoFocus from "./DaoFocus";
// import "./new.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

function Daos() {
  const [loading, toggleLoading] = useState(true);
  const [myDaos, setMyDaos] = useState([]);

  // const [showFocus, toggleShowFocus] = useState(true);
  const [showFocus, toggleShowFocus] = useState(false);

  const [daoFocusAddress, setDaoFocusAddress] = useState("");

  const resetDaoFocus = () => {
    setDaoFocusAddress("");
  };

  const getDaos = async () => {
    setTimeout(async () => {
      const addr = web3.eth.accounts.givenProvider.selectedAddress;
      const daos = await getDAOsByAddress(addr);
      console.log("daos", daos);

      setMyDaos(daos.reverse());
      toggleLoading(false);
    }, 500);
  };

  const setGetDaoInterval = () => {
    getDaos();
    setInterval(() => {
      getDaos();
    }, 1500);
  };

  useEffect(() => {
    setGetDaoInterval();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column trade-table">
      {daoFocusAddress.length > 0 ? (
        <DaoFocus resetDaoFocus={resetDaoFocus} daoAddress={daoFocusAddress} />
      ) : (
        <React.Fragment>
          <Headline text="My DAOs" />
          <JoinDAO />
          <DaoTable daos={myDaos} setDaoFocusAddress={setDaoFocusAddress} />
        </React.Fragment>
      )}
    </div>
  );
}

export default Daos;
