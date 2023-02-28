import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import {ethers} from "ethers";

//connect to metamask
//execute a function

export default function Home() {
  const [isConnected,setIsConnect] = useState(false);
  const [provider,setIsProvider] = useState();
  
  
  async function connect(){
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({method: "eth_requestAccounts"})
        setIsConnect(true)
        let connectedProvider = new ethers.providers.Web3Provider(window.ethereum)
        setSigner(connectedProvider.getSigner())
      } catch (e) {
        console.log(e)
      }
    }
  }



  return (
    <div className={styles.container}>
      Hello wouter sels
    </div>
  )
}
