import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./Nav.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

function TopNav() {
  const [address, setAddress] = useState();

  useEffect(() => {
    const getBal = async () => {
      try {
        const addr = web3.eth.accounts.givenProvider.selectedAddress;
        setAddress(addr);
      } catch(e){
        console.log(e)
      }
    };
    getBal();
  });

  return (
    <div className="top-nav mx-auto mt-3 mb-2 d-flex justify-content-between">
      <div className="my-auto project-name">EasyDAO</div>
      <div className="dropdown account">
        <button className="dropbtn"></button>
        <div className="dropdown-content">
          <div className="d-flex flex-column">
            <div>
              {address && address.slice(0, 6) + "..." + address.slice(36)}
            </div>
            {/* <div className="mt-2">
              LINK Bal:{" "}
              {Number(linkBalance) > 0 ? Number(linkBalance) / 10 ** 18 : "0"}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
