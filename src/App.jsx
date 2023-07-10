import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import abi from "./poo.json";
import { ethers } from "ethers";

import {findMetaMaskAccount} from "./findMetaMask.jsx"
const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
  
const App = () => {
  
  const [message,setMessage]= useState("")
  
  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [waveButton, SetwaveButton] = useState("Wave at me");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xEeaD68EEa8C4d73232d1f9d23712A8aDD5F155Aa";
  let process = "The transaction is being processed."
   /*
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        
        
        const waves = await wavePortalContract.getAllWaves();
        


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        wavesCleaned.reverse();
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  let num = 0;
  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  

  };
 
  const [result,setResult]= useState(false);
  const wave = async () => {
    SetwaveButton("Wait");
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log("mesa here");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        
        
        
        console.log("Mining...", waveTxn.hash);
        SetwaveButton("Processing");
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        alert("Transaction complete");
        SetwaveButton("Wave at me");
        await getAllWaves();
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        let value= await wavePortalContract.result();
        console.log(value);
        console.log("coming next");
        await value;
        console.log(value);
        setResult(await wavePortalContract.result());
        let res= "OOO La La You won!!!"
        if (result ===false){ res="BOOO!!! You Lost!!!"
        }
        document.getElementById("result").textContent = res
        
      } else {
        alert("Could Not Connect to Wallet");
        setTimeout(()=> {SetwaveButton("Wave at me")}, 3000);
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      alert("Get MetaMask!");
      console.log(error);
    }
  }

  const display_waves = async () => {
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(provider);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        
        
        
        console.log("Retrieved total wave count...", count.toNumber());
        document.getElementById("display").textContent = count.toNumber();
        num = count.toNumber();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  /*
   * This runs our function when the page loads.
   * More technically, when the App component "mounts". 
   */
  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);
  function handleChange(event){
    setMessage(event.target.value)
  }
  function Display_waves(props){
    return(
      props.value.map((wave, index) => {
      
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
           
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
           
        
    
      })
    ) }


  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          Say Hi to Smart Contract
        </div>

        <button className="waveButton" onClick={wave}>
          {waveButton}
        </button>
        <button className="waveButton" onClick={getAllWaves} >
          Get History
        </button>
       
         
       
        {!currentAccount && ( <form align = "center" >
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
            
          </button>
          <br></br><br></br>
          
          </form>
        )}
        {currentAccount && (<form className="message">
        <input
                type="text"
                placeholder="Enter the message"
                onChange={handleChange}
                size="40"
            />
          </form>)}
        
        
        <Display_waves value= {allWaves} />
      </div>
    </div>
  );
};

export default App;