const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    //we first need a pircefeed from the uniswap contract, we can either do this by:
    //1. calling the getAmountsOut function on the router contract with a given input
    //2. calling the executionprice on the uniswap sdk

    /*
        Router contract
    */

     //we need the ABI
     //we need a provider
     //we need the router address
     
     /*
     ABI's
     */

     const UNI_ROUTER_ABI = ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
    "function WETH() external pure returns (address)"]
     const UNI_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
     const provider = ethers.provider

     const uniRouter = new ethers.Contract(UNI_ROUTER_ADDRESS,UNI_ROUTER_ABI,provider)

     const wethAddress = await uniRouter.WETH()
     console.log(wethAddress)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })