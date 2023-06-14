import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

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
  const [newPurpose, setNewPurpose] = useState("loading...");

  const ThankYouPage = () => {
    useEffect(() => {
      // Prevent going back to the previous page
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener("popstate", () => {
        // Show continue resubmission error
        alert("Resubmission is not allowed!");
        window.history.pushState(null, document.title, window.location.href);
      });

      const redirectTimeout = setTimeout(() => {
        alert("Press Ok to End the session");
        window.location.href = "http://localhost/login/logout.php";
      }, 10);

      document.addEventListener("keydown", preventBypass);
      document.addEventListener("mousedown", preventBypass);
      document.addEventListener("touchstart", preventBypass);

      return () => {
        window.removeEventListener("popstate", () => {});
        clearTimeout(redirectTimeout);
        document.removeEventListener("keydown", preventBypass);
        document.removeEventListener("mousedown", preventBypass);
        document.removeEventListener("touchstart", preventBypass);
      };
    }, []);

    const preventBypass = (event) => {
      event.preventDefault();
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', fontSize: '40px' }}>
        <h1>Thank You for Voting!</h1>
        <p>Have a Good Day!</p>
      </div>
    );
  };

  return (
    <div>
      <ThankYouPage />
    </div>
  );
}
