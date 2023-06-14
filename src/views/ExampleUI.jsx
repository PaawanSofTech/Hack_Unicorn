import { Button, Divider, Select, notification } from "antd";
import React, { useState, useEffect } from "react";
import { Address, Events } from "../components";
import { useHistory } from "react-router-dom";

const { Option } = Select;

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isTransactionConfirmed, setIsTransactionConfirmed] = useState(false);
  const [isRefreshedOnce, setIsRefreshedOnce] = useState(false);
  const history = useHistory();

  const handleVoteClick = async () => {
    setIsButtonClicked(true);
    const result = tx(
      writeContracts.YourContract.setPurpose(newPurpose),
      (update) => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei"
          );
          setIsTransactionConfirmed(true);

          // Redirect to /hints after 2 seconds
          setTimeout(() => {
            history.push("/hints");
          }, 2000);
        }
      }
    );
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  useEffect(() => {
    if (isRefreshedOnce) {
      notification.warning({
        message: "Please Generate the Vote Token",
        placement: "bottomRight", // Change the placement to the desired position
      });
    }
  }, [isRefreshedOnce]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Prompt for Chrome
    };

    const handlePopState = () => {
      history.push("/");
    };

    if (window.performance) {
      if (performance.navigation.type === 1) {
        // Refreshed the page
        setIsRefreshedOnce(true);
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div>
      <div style={{ padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
        <h2>Enter the Ballot number:</h2>
        <br />
        <div style={{ margin: 8 }}>
          <Select
            onChange={(value) => {
              setNewPurpose(value);
            }}
            style={{ width: "50%" }}
            disabled={newPurpose !== "" || isButtonClicked}
          >
            <Option value="1" disabled={newPurpose !== ""}>
              Party A
            </Option>
            <Option value="2" disabled={newPurpose !== ""}>
              Party B
            </Option>
            <Option value="3" disabled={newPurpose !== ""}>
              Party C
            </Option>
            <Option value="4" disabled={newPurpose !== ""}>
              Party D
            </Option>
          </Select>
          <br />
          <br />
          <Button
            style={{ marginTop: 8 }}
            onClick={handleVoteClick}
            disabled={newPurpose === "" || isButtonClicked}
          >
            Vote!
          </Button>

          {isTransactionConfirmed && (
            <div style={{ marginTop: 16, textAlign: "center", fontSize: 16 }}>
              Thank You for Voting, Have a Good Day!
            </div>
          )}
        </div>
        <br />

        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <br />
      </div>

      {/* Display a list of events */}
      <Events
        contracts={readContracts}
        contractName="YourContract"
        eventName="SetPurpose"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />
    </div>
  );
}
