import React from "react";
import "./new.css";

function SubmitButton({ disabled, onClick, text }) {
  return (
    <button
      className="submit-button mx-auto mt-4 p-2"
      disabled={disabled}
      onClick={onClick}
    >
      {text ? text: "Submit"}
    </button>
  );
}

export default SubmitButton;
