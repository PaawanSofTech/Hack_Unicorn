import { Button } from "antd";
import React, { useState } from "react";
import { ethers } from "ethers";
import { useBalance, useGasPrice } from "eth-hooks";
import { useHistory } from "react-router-dom";

import { getRPCPollTime, Transactor } from "../helpers";

function FaucetHint({ localProvider, targetNetwork, address }) {
  const [faucetClicked, setFaucetClicked] = useState(false);
  const history = useHistory();

  const localProviderPollingTime = getRPCPollTime(localProvider);

  // fetch local balance
  const yourLocalBalance = useBalance(localProvider, address, localProviderPollingTime);

  // get gas Price from network
  const gasPrice = useGasPrice(targetNetwork, "fast", localProviderPollingTime);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  let faucetHint = "";

  const generateVoteToken = () => {
    faucetTx({
      to: address,
      value: ethers.utils.parseEther("0.01"),
    });
    setFaucetClicked(true);
    history.push("/exampleui"); // Use history.push instead of history.replace
  };

  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ position: "absolute", right: 55, top: 65, marginRight: "-30px", marginTop: "5px" }}>
        <Button type="primary" onClick={generateVoteToken}>
          Vote
        </Button>
      </div>
    );
  }

  return faucetHint;
}

export default FaucetHint;
