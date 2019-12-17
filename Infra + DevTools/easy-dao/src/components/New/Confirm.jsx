import React, { useState, useEffect } from "react";
import Headline from "../common/Headline";
import OptionLine from "./OptionLine";
import SubmitButton from "./SubmitButton";
import { withRouter } from "react-router";

function Confirm({ daoAddress, history }) {
  return (
    <div className="d-flex flex-column">
      <Headline text="Deployment Confirmed!" />
      <OptionLine>
        My DAO's address: <code>{daoAddress}</code>
      </OptionLine>
      <OptionLine>Send your new DAO's address to other members</OptionLine>
      <SubmitButton text="See my DAOs" onClick={() => history.push("/my")} />
    </div>
  );
}

export default withRouter(Confirm);
