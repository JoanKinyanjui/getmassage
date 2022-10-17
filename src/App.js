import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import { loadCurrentMessage , helloWorldContract,connectWallet, getCurrentWalletConnected, updateMessage} from './utils/interact';

function App() {
//State variables
const [walletAddress, setWalletAddress] = useState("");
const [status, setStatus] = useState("We are happy you are here!!!");
const [message, setMessage] = useState("No connection to the network.");
const [newMessage, setNewMessage] = useState("");

  useEffect(()=>{
    async function fetchData(){
      const  message=await loadCurrentMessage();
      setMessage(message)
    }

    fetchData();
  
addSmartContractListener();
async function currentWalletConnected (){
  const {address,status} = await getCurrentWalletConnected();
  setWalletAddress(address)
  setStatus(status)

  addWalletListener();
}
currentWalletConnected();
  }, []);

//SmartrContract Listener which listens to the event
function addSmartContractListener() {
  helloWorldContract.events.UpdatedMessage({}, (error, data) => {
    if (error) {
      setStatus("😥 " + error.message);
    } else {
      setMessage(data.returnValues[1]);
      setNewMessage("");
      setStatus("🎉 Your message has been updated!");
    }
  });
}

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      } else {
        setWalletAddress("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}


//Onclickung the button...
const connectWalletPressed = async () => { //TODO: implement
 const walletResponse = await connectWallet();
 setStatus(walletResponse.status);
 setWalletAddress(walletResponse.address);
};

//On updating the message...
const onUpdatePressed = async () => { //TODO: implement
const {status} = await updateMessage(walletAddress,newMessage);
setStatus(status)
};

//onhandle change input value...
function handleChange(event) {
  return(
 setNewMessage(event.target.value)
  )
  
}


  return (
<>
<h2 className='smart-contract'>Hi! Welcome to my first Smart Contract</h2>
<div className='wallet-div'><button className='wallet-button' onClick={connectWalletPressed}>
  {walletAddress.length >0 ? "Connected" : "Connect Wallet"}
  </button></div>
<div ><p className='p'>Current Message:</p>{message}</div>
<div ><p className='p'>New Message:</p>
<input 
className='input-value'
type='text'
name='text'
placeholder='type new message...'
onChange={handleChange}
value={newMessage}
/>

<button className='input-button' onClick={onUpdatePressed}>Update</button>
<div className='status'><i>{status}</i></div>
</div>
</>
  );
}

export default App;
