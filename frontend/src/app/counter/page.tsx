"use client";

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import Counter from "../../../../blockchain/artifacts/contracts/Counter.sol/Counter.json"; // if you dont have this you need to do a 'npx hardhat compile' in the blockchain directory

const counterAddress = "0xd0A8BBF6c750bab74d32d13a830EA08e2897f7ab";
const { ethereum } = window as any;

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const data = await readCounterValue();
      return data;
    };

    fetchCount().catch(console.error);
  }, []);

  async function requestAccount() {
    await ethereum.request({ method: "eth_requestAccounts" });
  }

  async function updateCounter() {
    if (typeof ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(ethereum);
      console.log({ provider });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(counterAddress, Counter.abi, signer);
      const transaction = await contract.increment();
      setIsLoading(true);
      await transaction.wait();
      setIsLoading(false);
      readCounterValue();
    }
  }

  async function readCounterValue() {
    if (typeof ethereum !== null) {
      const provider = new ethers.BrowserProvider(ethereum);

      console.log("provider", provider);

      const contract = new ethers.Contract(
        counterAddress,
        Counter.abi,
        provider
      );

      console.log("contract", contract);

      try {
        const data = await contract.retrieve();
        console.log(data);
        console.log("data: ", parseInt(data.toString()));
        setCount(parseInt(data.toString()));
      } catch (err) {
        console.log("Error: ", err);
        alert(
          "Switch your MetaMask network to Polygon zkEVM Testnet and refresh this page!"
        );
      }
    }
  }

  const incrementCounter = async () => {
    await updateCounter();
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ minWidth: 275, marginTop: 20 }}>
        <CardContent>
          <p>Count: {count}</p>
          <Button
            onClick={incrementCounter}
            variant="outlined"
            disabled={isLoading}
          >
            {isLoading ? "loading..." : "+1"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
