const { ethers } = require("ethers");
//const { contractAddress, testERC20_ABI } = require("constants.js");
import { contractAddress, testERC20_ABI } from "./constants.js";

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" });
  }
}

async function execute() {
  // address
  // ABI - function
  // node connection - signer/provider

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, testERC20_ABI, signer);
  const signerBalance = await contract.balanceOf(provider);
  connsole.log(signerBalance);
}

module.exports = {
  connect,
  execute,
};
