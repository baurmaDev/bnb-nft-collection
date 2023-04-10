import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const ConnectWalletButton = () => {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const connectWallet = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      localStorage.setItem('address', address)
      setProvider(provider);
      setWalletAddress(address);
    };

    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setProvider(provider);
      setWalletAddress(address);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSwitchWallet = async () => {
  //   try {
  //     await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();
  //     setProvider(provider);
  //     setWalletAddress(address);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  if (walletAddress) {
    return (
      <button style={{width: '100px', height: '25px', borderRadius: '16px', border: 'none'}} onClick={() => navigate('/profile/collection')}>My list</button>
    );
  }

  return (
    <button style={{width: '100px', height: '25px', borderRadius: '16px', border: 'none'}} onClick={handleConnectWallet}>Connect Wallet</button>
  );
};

export default ConnectWalletButton;
