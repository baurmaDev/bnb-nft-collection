import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from './assets/abi/BaurmaNFT.json'
import IPFS from 'ipfs-http-client';
import List from "./components/List";
import MyCollection from "./components/MyCollection";
import { Routes,Route } from "react-router-dom";
import AppBar from './components/AppBar'



const BaurmaNFTAddress = "0x42829d1F793e17CB3ca7E971a2d2cAF692E4ce09";
const contractAddress = "0x26360Dd3977C26AC8DB95763f8868DfA308C1EA3";

function App() {
  const [status, setStatus] = useState("");
  const [recipient, setRecipient] = useState("");
  const [data, setData] = useState([])
  const [totalSupply, setTotalSupply] = useState(0)
  

  async function mint() {
    console.log("Minting started")
    if (!recipient) {
      setStatus("Please enter a recipient address");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    setStatus("Minting NFT...");
    
    try {
      const result = await contract.safeMint(recipient,{value: ethers.utils.parseEther("0.001").toString()},);
      setStatus(`NFT minted successfully! Transaction hash: ${result.hash}`);
    } catch (e) {
      console.log(e);
      setStatus("Error minting NFT");
    }
  }
  async function getMetaData(tokenId){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    try {
      const result = await contract.tokenURI(tokenId);
      console.log("Result: ", result)
    } catch (e) {
      console.log(e);
    }
  }
  async function getTotalSupply(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    try {
      const result = await contract.totalSupply();
      setTotalSupply(parseInt(result, 16))
      console.log("Result: ", result)
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getTotalSupply()
  }, [])

  return (
    <>
      <AppBar />
      <div style={{
        padding: '50px'
      }}>
        <Routes>
          <Route path='/' element={<List totalSupply={totalSupply} />} />
          <Route path='/profile/collection' element={<MyCollection totalSupply={totalSupply} />} />
        </Routes>
      </div>
    </> 
    
    // <div style={{padding: '50px'}}>
    //   <div style={{marginBottom: '30px'}}>
        // <h2>Mint an NFT</h2>
        // <div>
        //   <label>Recipient address:</label>
        //   <input
        //     type="text"
        //     onChange={(e) => setRecipient(e.target.value)}
        //     value={recipient}
        //   />
        // </div>
    //     <button onClick={mint}>Mint NFT</button>
    //     <div>{status}</div>
    //   </div>
    //   {/* <MyCollection /> */}
    //   {
    //     totalSupply && (
    //       <List totalSupply={totalSupply} />
    //     )
    //   }
      
    // </div>
    
  );
}

export default App;
