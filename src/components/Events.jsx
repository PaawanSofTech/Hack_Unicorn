import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Address from "./Address";

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  const seenAddresses = new Set(); // Set to keep track of unique addresses

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Live Results:</h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          const address = item.args[0];
          if (seenAddresses.has(address)) {
            return (
              <List.Item key={item.blockNumber + "_" + address}>
                <span style={{marginLeft: "90px" , color: "red" }}>
                  Duplicate address: <Address address={address} ensProvider={mainnetProvider} fontSize={16}/>
                </span>
              </List.Item>
            );
          }

          seenAddresses.add(address);

          return (
            <List.Item key={item.blockNumber + "_" + address}>
              <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
              {item.args[1]}
            </List.Item>
          );
        }}
      />
    </div>
  );
}

