import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import abi from "./poo.json";
import { ethers } from "ethers";
import {findMetaMaskAccount,getAllWaves,num,connectWallet,wave,display_waves, handleChange ,Display_waves} from "./findMetaMask.jsx"
const getEthereumObject = () => window.ethereum;

const App = () => {
  // const [message,setMessage]= useState("")
  const [currentAccount, setCurrentAccount] = useState("");
  // /*
  //  * All state property to store all waves
  //  */
  // const [waveButton, SetwaveButton] = useState("Wave at me");
  // const [allWaves, setAllWaves] = useState([]);
  // const contractAddress = "0xEeaD68EEa8C4d73232d1f9d23712A8aDD5F155Aa";
  // let process = "The transaction is being processed."
  //  /*
  //  * Create a variable here that references the abi content!
  //  */
  // const contractABI = abi.abi;

  /*
   * Create a method that gets all waves from your contract
   */

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