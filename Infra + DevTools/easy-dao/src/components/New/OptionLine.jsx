import React from "react";
import "./new.css";

function OptionLine({ children }) {
  return (
    <div className="option-line d-flex mx-auto mt-3">
      <div className="d-flex">
        <div className="decision-point my-auto">{children}</div>
      </div>
    </div>
  );
}

export default OptionLine;