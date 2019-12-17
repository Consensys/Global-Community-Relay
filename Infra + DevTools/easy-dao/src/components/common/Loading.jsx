import React from "react";
import { BarLoader } from "react-spinners";

function Loading() {
  return (
    <div className="mx-auto my-auto">
      <BarLoader size="150px" />
    </div>
  );
}

export default Loading;
