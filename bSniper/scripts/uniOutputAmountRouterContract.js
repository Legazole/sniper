const { ethers } = require("hardhat")

async function main() {
    //we need a token price from uniswap
    //we call the uniRouter contract with an amountsOut for link given 1 usdc

    /*
        Variables
    */
    const UNI_ROUTER_ABI = [
        "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
        "function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) pure returns (uint amountOut)",
        "function factory() external pure returns (address)",
    ]
    const UNI_PAIR_ABI = [
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    ]
    const UNI_FACTORY_ABI = [
        "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    ]

    const UNI_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    const LINK_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

    const uniRouter = new ethers.Contract(
        UNI_ROUTER_ADDRESS,
        UNI_ROUTER_ABI,
        ethers.provider
    )

    const UNI_FACTORY_ADDRESS = await uniRouter.factory()

    const uniFactory = new ethers.Contract(
        UNI_FACTORY_ADDRESS,
        UNI_FACTORY_ABI,
        ethers.provider
    )

    const pairAddress = await uniFactory.getPair(USDC_ADDRESS, LINK_ADDRESS)

    const pairContract = new ethers.Contract(
        pairAddress,
        UNI_PAIR_ABI,
        ethers.provider
    )

    console.log("********************")
    console.log("USDC/LINK INFO")
    console.log("********************\n")
    console.log("\tPair Address: ")
    console.log(pairAddress)

    console.log("\n\tPair Reserves:")
    const [reserveLink, reserveUsdc] = await pairContract.getReserves()
    console.log(`Link reserves: ${reserveLink} \nUsdc reserves: ${reserveUsdc}`)
    console.log("-----------with decimals----------")
    const linkReserveWithDecimal = parseInt(reserveLink) / 10 ** 18
    console.log(`${linkReserveWithDecimal} LINK`)
    const usdcReserveWithDecimal = parseInt(reserveUsdc) / 10 ** 6
    console.log(`${usdcReserveWithDecimal} USDC`)
    console.log("----------------------------------")

    /*
        Value needed for arbitrage possibility check
    */
    const pricePerLink = usdcReserveWithDecimal / linkReserveWithDecimal
    console.log("Calculated midPrice with given reserves")
    console.log(pricePerLink)
    /*
        USDC/Link => how much usdc can I buy with 1 link

     */

    //check how much usdc token we get for one link
    //directions of trade LINK => USDC
    //1 LINK = ? USDC

    //Always keep in mind decimals usages for correct prices

    console.log(
        "Calculated amountOut for given reserves and amountIntoNewReserves"
    )
    const amountIntoInputToken = ethers.utils.parseEther("1") // this works cause ether also uses 18 decimals
    const amountOut = await uniRouter.getAmountOut(
        amountIntoInputToken,
        /* amountToCheck *10**x (x=>decimals of input token */
        reserveLink, //input Token
        reserveUsdc //output Token
    )

    //Amount we got in amountOut is in the new token, so we should adjust for decimals
    console.log(amountOut.toString() / 10 ** 6)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
