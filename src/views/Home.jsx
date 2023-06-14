import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";


const highlight = {
  marginLeft: 4,
  marginRight: 8,
  /* backgroundColor: "#f9f9f9", */ padding: 4,
  borderRadius: 4,
  fontWeight: "bolder",
};
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <div style={{ margin: 32 }}>
        <h1>Voting Instructions{" "}</h1>
        <h3>1.) Click on<span className="highlight" style={highlight}>Vote
        </span>to proceed!</h3>
      </div>
    </div>
  );
}

export default Home;
