import { KeyOutlined, QrcodeOutlined, SendOutlined, WalletOutlined } from "@ant-design/icons";
import { Button, message, Modal, Spin, Tooltip, Typography } from "antd";
import { ethers } from "ethers";
import QR from "qrcode.react";
import React, { useEffect, useState } from "react";

import { Transactor } from "../helpers";
import Address from "./Address";
import AddressInput from "./AddressInput";
import Balance from "./Balance";
import EtherInput from "./EtherInput";
import WalletImport from "./WalletImport";

const { Text } = Typography;

/**
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <Wallet
    provider={userProvider}
    address={address}
    ensProvider={mainnetProvider}
    price={price}
    color='red'
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
**/

export default function Wallet(props) {
  const [signerAddress, setSignerAddress] = useState();
  useEffect(() => {
    async function getAddress() {
      if (props.signer) {
        const newAddress = await props.signer.getAddress();
        setSignerAddress(newAddress);
      }
    }
    getAddress();
  }, [props.signer]);

  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState();
  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  const [pk, setPK] = useState();

  const [showImport, setShowImport] = useState();

  const providerSend = props.provider ? (
    <Tooltip >
      <Button
        onClick={() => {
          setOpen(!open);
        }}
        rotate={-90}
        style={{
          backgroundColor: "#2CAAD9",
          color:"White",
          cursor: "pointer",
          verticalAlign: "middle",
          title: "Vote access",
          marginRight:"5px",
          marginLeft:"20px",
          marginBottom: "-15px",
          borderRadius:"5px",
          height:"35px",
          transition: 'opacity 0.3s ease-in-out',
          transition: 'opacity 0.3s ease-in-out',
          /* Default styles */
          opacity: 1,
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = 0.5; // Change opacity on hover
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = 1; // Restore default opacity when not hovering
        }}
      >
        Vote Access
      </Button>
      
      <Button type="primary"
  onClick={() => {
    const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
    if (currentPrivateKey) {
      window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
    }
    const randomWallet = ethers.Wallet.createRandom();
    const privateKey = randomWallet._signingKey().privateKey;
    window.localStorage.setItem("metaPrivateKey", privateKey);
    window.location.href = "/"; // Redirect to the root path
  }}
  style={{
    backgroundColor: "#2CAAD9",
    color: "White",
    cursor: "pointer",
    verticalAlign: "middle",
    title: "Vote access",
    marginRight: "10px",
    marginLeft: "5px",
    marginBottom: "-15px",
    borderRadius: "5px",
    height: "35px",
    transition: "opacity 0.3s ease-in-out",
    /* Default styles */
    opacity: 1,
  }}
  onMouseEnter={(e) => {
    e.target.style.opacity = 0.5; // Change opacity on hover
  }}
  onMouseLeave={(e) => {
    e.target.style.opacity = 1; // Restore default opacity when not hovering
  }}
>
  Generate Private Key
</Button>


    </Tooltip>
    
  )
   : (
    ""
  );

  let display;
  let receiveButton;
  let privateKeyButton;
  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size="450"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </div>
    );
    privateKeyButton = (
      <Button
        key="hide"
        onClick={() => {
          setPK(selectedAddress);
          setQr("");
        }}
      >
        <KeyOutlined /> Private Key
      </Button>
    );
  } else if (pk) {
    const pk = localStorage.getItem("metaPrivateKey");
    const wallet = new ethers.Wallet(pk);

    if (wallet.address !== selectedAddress) {
      display = (
        <div>
        <Button
          onClick={() => {
            const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
            if (currentPrivateKey) {
              window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
            }
            const randomWallet = ethers.Wallet.createRandom();
            const privateKey = randomWallet._signingKey().privateKey;
            window.localStorage.setItem("metaPrivateKey", privateKey);
            window.location.reload();
          }}
        >
          Generate
        </Button>
      </div>
      );
    } else {
      const extraPkDisplayAdded = {};
      const extraPkDisplay = [];
      extraPkDisplayAdded[wallet.address] = true;
      extraPkDisplay.push(
        <div style={{ fontSize: 16, padding: 2, backgroundStyle: "#89e789" }}>
          <a href={"/pk#" + pk}>
            <Address minimized address={wallet.address} ensProvider={props.ensProvider} /> {wallet.address.substr(0, 6)}
          </a>
        </div>,
      );
      for (const key in localStorage) {
        if (key.indexOf("metaPrivateKey_backup") >= 0) {
          const pastpk = localStorage.getItem(key);
          const pastwallet = new ethers.Wallet(pastpk);
          if (!extraPkDisplayAdded[pastwallet.address] /* && selectedAddress!=pastwallet.address */) {
            extraPkDisplayAdded[pastwallet.address] = true;
            extraPkDisplay.push(
              <div style={{ fontSize: 16 }}>
                <a href={"/pk#" + pastpk}>
                  <Address minimized address={pastwallet.address} ensProvider={props.ensProvider} />{" "}
                  {pastwallet.address.substr(0, 6)}
                </a>
              </div>,
            );
          }
        }
      }

      const fullLink = "https://punkwallet.io/pk#" + pk;

      display = (
        <div>

          {extraPkDisplay ? (
            <div>
              <Button
                onClick={() => {
                  const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
                  if (currentPrivateKey) {
                    window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
                  }
                  const randomWallet = ethers.Wallet.createRandom();
                  const privateKey = randomWallet._signingKey().privateKey;
                  window.localStorage.setItem("metaPrivateKey", privateKey);
                  window.location.reload();
                }}
              >
                Generate
              </Button>
            </div>
          ) : (
            ""
          )}
          <div>
            <b>Private Key:</b>
            <div>
              <Text style={{ fontSize: 11 }} copyable>
                {pk}
              </Text>
            </div>

            <br />
            <i>
              Point your camera phone at qr code to get the acess token &nbsp;
              :
            </i>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                const el = document.createElement("textarea");
                el.value = fullLink;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
                message.success(<span style={{ position: "relative" }}>Copied Private Key Link</span>);
              }}
            >
              <QR value={fullLink} size="450" level="H" includeMargin renderAs="svg" />
            </div>
          </div>

        </div>
      );
    }

    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPK("");
        }}
      >
        <QrcodeOutlined /> Receive
      </Button>
    );
    
  } else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
            autoFocus
            ensProvider={props.ensProvider}
            placeholder="Scan Your Face & Enter the ID number"
            address={toAddress}
            onChange={setToAddress}
          />
        </div>

      </div>
    );
    
    privateKeyButton = (
      
      <Button
        onClick={() => {
          const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
          if (currentPrivateKey) {
            window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
          }
          const randomWallet = ethers.Wallet.createRandom();
          const privateKey = randomWallet._signingKey().privateKey;
          window.localStorage.setItem("metaPrivateKey", privateKey);
          window.location.reload();
        }}
      >
        Generate
      </Button>
    
    );
    
  }

  return (
    <span>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress ? <Address address={selectedAddress} ensProvider={props.ensProvider} /> : <Spin />}
            <div style={{ float: "right", paddingRight: 25 }}>
              <Balance address={selectedAddress} provider={props.provider} dollarMultiplier={props.price} />
            </div>
          </div>
        }
        onOk={() => {
          setQr();
          setPK();
          setOpen(!open);
        }}
        onCancel={() => {
          setQr();
          setPK();
          setOpen(!open);
        }}
        footer={
          showImport
            ? null
            : [
                
                privateKeyButton,
                receiveButton,
                privateKeyButton = (
                  <Button
                    key="hide"
                    onClick={() => {
                      setPK(selectedAddress);
                      setQr("");
                    }}
                  >
                    <KeyOutlined /> Private Key
                  </Button>
                )
              ]
        }
      >
        {showImport ? <WalletImport setShowImport={setShowImport} /> : display}
      </Modal>
    </span>
  );
}
