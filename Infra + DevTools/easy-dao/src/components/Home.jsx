import React, { useState } from "react";
import Nav from "./Nav";
import New from "./New/New";
import Daos from "./Daos/Daos";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Route, withRouter } from "react-router";
import "./Home.css";

function Welcome({ history }){
  const connect = async() => {
    await window.ethereum.enable();
    history.push("/new")
  }

  return (
    <div className="mx-auto my-auto">
      <button
        className="accept-button p-3"
        onClick={connect}
      >
        Connect to EasyDAO
        </button>
    </div>
  )
}

function RouterComponent() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/" component={withRouter(Welcome)} />
        <Route exact path="/new" component={New} />
        <Route exact path="/my" component={Daos} />
      </Switch>
    </Router>
  );
}

function Home() {
  return (
    <div className="d-flex flex-column home mt-2 mx-auto">
      <RouterComponent />
    </div>
  );
}

export default Home;
