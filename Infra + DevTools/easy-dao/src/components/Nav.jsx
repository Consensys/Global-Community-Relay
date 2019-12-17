import React from "react";
import { withRouter } from "react-router";
import "./Nav.css";

function Nav({ history }) {
  const currPath = window.location.pathname;
  return (
    <nav className="d-flex justify-content-around nav px-4 py-3">
      <div
        className={`nav-item ${currPath !== "/new" && "nav-item-inactive"}`}
        onClick={() => history.push("/new")}
      >
        New
      </div>
      <div
        className={`nav-item ${currPath !== "/my" && "nav-item-inactive"}`}
        onClick={() => history.push("/my")}
      >
        My DAOs
      </div>
    </nav>
  );
}

export default withRouter(Nav);
