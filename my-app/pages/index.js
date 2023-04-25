import Head from 'next/head'
// import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useRef, useState } from "react"

import { providers } from "ethers"
import Web3Modal from "web3modal"

export default function Home() {


  const [walletConnected, setWalletConnected] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [ens, setENS] = useState("");
  // Save the address of the currently connected account
  const [address, setAddress] = useState("");

  const web3ModalRef = useRef();


  /**
   * Sets the ENS, if the current connected address has an associated ENS or else it sets
   * the address of the connected account
   */
  const setENSOrAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false
      })
    } else {
      // getAmounts();
    }

  }, [walletConnected]);
  

    /**
 * Returns a Provider or Signer object representing the Ethereum RPC with or
 * without the signing capabilities of Metamask attached
 *
 * A `Provider` is needed to interact with the blockchain - reading
 * transactions, reading balances, reading state, etc.
 *
 * A `Signer` is a special type of Provider used in case a `write` transaction
 * needs to be made to the blockchain, which involves the connected account
 * needing to make a digital signature to authorize the transaction being
 * sent. Metamask exposes a Signer API to allow your website to request
 * signatures from the user using Signer functions.
 *
 * @param {*} needSigner - True if you need the signer, default false
 * otherwise
 */

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please, change the network to the Goerli!" + chainId);
      throw new Error("Incorrect network: " + chainId);
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      await setENSOrAddress(address, web3Provider);
      return signer;
    }
    
    return web3Provider;
  }


  function renderConnectButton() {
    if (!walletConnected) {
      return (
        <div>
          {/* <div className={styles.description}>
            The place where you can exchange your Crypro Dev Tokens!
          </div> */}
          <div>
            <button className={styles.button} onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        </div>
      )
    }
  }

  function renderENS() {
    if (walletConnected) {
      return (
        <div>
          <div className={styles.description}>
            Your ENS domain is {ens ? ens : address}
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <Head>
        <title>
          ENS explore
        </title>
        <meta name="description" content="DEX" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <div>
            <h1 className={styles.title}>
              Here you can check your ENS domain!
            </h1>

          </div>

          {walletConnected ? renderENS() : renderConnectButton()}

        </div>

        {/* <div>
          <img className={styles.image} src='/0.svg' />
        </div> */}

      </div>



      <footer className={styles.footer}>
        From ABaaaC with &#9829;
      </footer>
    </div>
  )
}
