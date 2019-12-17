import React, { useState, useEffect } from "react";
import Headline from "../common/Headline";
import Loading from "../common/Loading";
import Confirm from "./Confirm";
import SubmitButton from "./SubmitButton";
import Select from "react-select";
import { createDAO, DAOFactoryContractEthers } from "../../services/daoFactory";
// import {
//   createTrade,
//   FTFContractEthers
// } from "../../services/forexTradeFactory";
import Web3 from "web3";
import "./new.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const TYPE_OPTIONS = ["Event", "Trip", "Giving"];
const VALUE_OPTIONS = ["0.1", "1", "10", "100"]; // ether
const VOTING_PERIOD_OPTIONS = ["1", "6", "24", "48"]; // hours

const typeOptions = TYPE_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

const valueOptions = VALUE_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

const votingPeriodOptions = VOTING_PERIOD_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

function New() {
  const [txProcessing, toggleTxProcessing] = useState(false);

  const [typeOption, setTypeOption] = useState();
  const [valueOption, setValueOption] = useState();
  const [votingPeriodOption, setVotingPeriodOption] = useState();

  const [formFields, toggleFormFields] = useState([false, false, false]);

  const [showConfirm, toggleShowConfirm] = useState(false);
  const [daoAddress, setDaoAddress] = useState("");

  const setFormFields = idx => {
    const fields = [...formFields];
    fields[idx] = true;
    toggleFormFields(fields);
  };

  const handleTypeChange = selectedOption => {
    setTypeOption(selectedOption);
    setFormFields(0);
  };

  const handleValueChange = selectedOption => {
    setValueOption(selectedOption);
    setFormFields(1);
  };

  const handleVotingPeriodChange = selectedOption => {
    setVotingPeriodOption(selectedOption);
    setFormFields(2);
  };

  const deployDao = async () => {
    toggleTxProcessing(true);

    const contr = await DAOFactoryContractEthers();
    contr.on("DAOGenerated", (oldValue, newValue, event) => {
        toggleTxProcessing(false);
        toggleShowConfirm(true);
        setDaoAddress(event.args.daoContract)
    })

    console.log(typeOption.value, valueOption.value, votingPeriodOption.value)
    await createDAO(typeOption.value, valueOption.value, votingPeriodOption.value);
  };

  if (txProcessing) {
    return <Loading />;
  }

  if (showConfirm) { 
    return (
      <Confirm
        daoAddress={daoAddress}
      />
    );
  }

  return (
    <div className="d-flex flex-column">
      <Headline text="Build a New DAO" />
      <div className="option-line d-flex mx-auto mt-3">
        <div className="d-flex">
          <div className="decision-point my-auto">I want to deploy a(n) </div>
          <Select
            className="react-select-container ml-2"
            value={typeOption}
            onChange={handleTypeChange}
            options={typeOptions}
            placeholder="Type"
          />
          <div className="decision-point my-auto ml-2">DAO</div>
        </div>
      </div>
      <div
        className={`option-line d-flex mx-auto mt-4 ${!formFields[0] &&
          "add-opacity"}`}
      >
        <div className="d-flex">
          <div className="decision-point my-auto">with a entry fee of</div>
          <Select
            className="react-select-container ml-2"
            value={valueOption}
            onChange={handleValueChange} //counterpartyasset
            options={valueOptions}
            isDisabled={!formFields[0]}
            placeholder="Value"
          />
          <div className="decision-point my-auto ml-2">ETH</div>
        </div>
      </div>
      <div
        className={`option-line d-flex mx-auto mt-4 ${!formFields[1] &&
          "add-opacity"}`}
      >
        <div className="d-flex">
          <div className="decision-point my-auto">and a voting period of</div>
          <Select
            className="react-select-container ml-2"
            value={votingPeriodOption}
            onChange={handleVotingPeriodChange}
            options={votingPeriodOptions}
            placeholder="Value"
          />
          <div className="decision-point my-auto ml-2">hours.</div>
        </div>
      </div>
      <div
        className={`option-line d-flex mx-auto mt-4 ${!formFields[2] &&
          "add-opacity"}`}
      >
        <div className="d-flex">
          <div className="decision-point my-auto">
            I'll be depositing {valueOption ? Number(valueOption.value) : 0} ETH
            and deploying a DAO.
          </div>
        </div>
      </div>
      <SubmitButton
        onClick={deployDao}
        disabled={formFields.filter(ff => ff === false).length}
      />
    </div>
  );
}

export default New;
