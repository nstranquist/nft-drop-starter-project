import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'MetaTeds';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  
  // For now, will only be supporting Phantom Wallet
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if(solana) {
        if(solana.isPhantom) {
          console.log("phantom wallet found")

          // Check that we have permission to connect to the user's wallet
          // see more: https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting
          const response = await solana.connect({ onlyIfTrusted: true })
          console.log("Connected with public key:", response.publicKey.toString())
        
          setWalletAddress(response.publicKey.toString())
        }
      }
      else
        alert("Solana object not found. Get a phantom wallet")
    }
    catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    const { solana } = window

    if(!solana) return;
  
    const response = await solana.connect()
    console.log('connected with pubkey:', response.publicKey.toString())
    setWalletAddress(response.publicKey.toString())
  }

  // Render the button when the user hasn't connected their wallet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
