const { getNamedAccounts, ethers } = require("hardhat")
const {
    ChainId,
    Token,
    Fetcher,
    WETH,
    Route,
    Trade,
    TokenAmount,
    TradeType,
} = require("@uniswap/sdk")
const UNISWAP = require("@uniswap/sdk")
require("dotenv").config()
const { getImpersonatedSigner } = require("@nomiclabs/hardhat-ethers")

async function main() {
    //listen to price feeds on uniswap & sushiswap
    const { deployer } = await getNamedAccounts()
    const iSigner = await ethers.getImpersonatedSigner(
        "0x821A96fbD4465D02726EDbAa936A0d6d1032dE46"
    )
    const chainId = ChainId.MAINNET
    const decimals = 18
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.MAINNET_RPC_URL
    )

    console.log("Current block gotten from provider")
    console.log("------------------------------------")
    let timeStamp = await provider.getBlockNumber()
    console.log(timeStamp)
    console.log("------------------------------------")

    /*
        Addressess
    */
    const UNISWAP_V2_ROUTER_ADDRESS =
        "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
    const SUSHISWAP_V2_ROUTER_ADDRESS =
        "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
    const UNISWAP_V2_FACTORY_ADDRESS =
        "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    const UNISWAP_V2_LIBRARY_ADDRESS =
        "0x9ac08370a3803a2a108052e2f7cd345288399dbc"
    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const LINK_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA"

    /*
        ABI's
    */

    const PAIR_ABI = [
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    ]
    const FACTORY_ABI = [
        "function getPair(address tokenA,address tokenB) external view returns(address)",
    ]
    const IERC20_ABI = ["function decimals() public view returns(uint8)"]
    const ROUTER_ABI = [
        "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
        "function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)",
    ]

    /*
        Contract initilaztions
    */

    const uniRouter = new ethers.Contract(
        UNISWAP_V2_ROUTER_ADDRESS,
        ROUTER_ABI,
        ethers.provider
    )
    const uniFactory = new ethers.Contract(
        UNISWAP_V2_FACTORY_ADDRESS,
        FACTORY_ABI,
        ethers.provider
    )
    const wethContract = new ethers.Contract(
        WETH_ADDRESS,
        IERC20_ABI,
        ethers.provider
    )
    const linkContract = new ethers.Contract(
        LINK_ADDRESS,
        IERC20_ABI,
        ethers.provider
    )

    console.log(
        `Link erc20 contract address : ${linkContract.address}\nWeth erc20 contract address : ${wethContract.address}`
    )
    const linkDecimals = await linkContract.decimals()
    const wethDecimals = await wethContract.decimals()

    console.log(
        `link decimals : ${linkDecimals} & weth decimals : ${wethDecimals}`
    )

    //we can check for the pair address by either calling the getPair function on the factory
    //we can preform an onchain lookup.
    //we can use the SDK

    //Calling the getPair function on Factory
    const address = await uniFactory.getPair(WETH_ADDRESS, LINK_ADDRESS)
    console.log(
        "WETH/LINK pair contrat address created by UNISWAP FACTORY contract"
    )
    console.log(address.toString())
    //Onchain lookup
    const pairAddress = "0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974"
    console.log(
        `WETH/LINK pair contract address looked up on chain: \n${pairAddress}`
    )
    //Uniswap SDK

    console.log("\n\nStarting arb bot setup\n\nDisplaying data:")
    //several ways to do this
    // 1. call the getReserves function on the pair.
    console.log("LINK/WETH reserves.")
    const pairContract = new ethers.Contract(address, PAIR_ABI, ethers.provider)
    const [reserves0, reserves1] = await pairContract.getReserves()
    const amountOfLink = ethers.utils.formatEther(reserves0.toString())
    const amountOfWeth = ethers.utils.formatEther(reserves1.toString())
    console.log(
        `Amount of link: ${amountOfLink}\nAmount of weth: ${amountOfWeth}`
    )

    const pricePerWeth = amountOfLink / amountOfWeth

    console.log(`Amount of link for 1 eth ${pricePerWeth.toString()}`)
    console.log("----------------------------------------------")

    // 2. use the SDK?
    const link = await Fetcher.fetchTokenData(
        chainId,
        linkContract.address,
        iSigner
    )

    const pair = await Fetcher.fetchPairData(link, WETH[chainId], iSigner)

    const route = new Route([pair], WETH[link.chainId])
    const trade = new Trade(
        route,
        new TokenAmount(WETH[link.chainId], ethers.utils.parseEther("1")),
        TradeType.EXACT_INPUT
    )
    console.log("Mid price of link/eth")
    console.log(
        "This is a representation of the reservers and not the actual price you'll get"
    )
    console.log(route.midPrice.toSignificant(6))
    console.log("Execution price of link/eth")
    console.log(
        "Given an input amount (1eth in this example) how much link will you get"
    )
    console.log(trade.executionPrice.toSignificant(6))
    console.log("next mid price of link/eth")
    console.log(
        "should our trade of 1 eth go through, what is the then current price based on the reserves?"
    )
    console.log(trade.nextMidPrice.toSignificant(6))

    // the execution price get calculated with the swapExactTokensForTokens function
    // the swapExactTokensForTokens function calls the getAmountsOut library function
    // which given an input token will calculate the exact amount of output tokens

    /*
        The problem with making your own helper solidity contract
        = each initilization cost gas
        We are thus better of using the already existing Router contract
        calling the getAmountsOut function and changing the input variables.
    */

    console.log(
        "Using the SDK we can get the execution price for 1 link to eth"
    )
    console.log(`this is: ${trade.executionPrice.invert().toSignificant(6)}`)

    console.log(
        "Using the getAmountsOut function on the uniswap Router we can get "
    )
    const path = [linkContract.address, wethContract.address]
    const tradeAmountInEth = ethers.utils.parseEther("1")
    const [outputAmount1, outputAmount2] = await uniRouter.getAmountsOut(
        tradeAmountInEth,
        path
    )
    console.log(
        `Given ${ethers.utils.formatEther(
            tradeAmountInEth
        )} link, we can get back\nin link:`
    )
    console.log(ethers.utils.formatEther(outputAmount1.toString()))
    console.log("in eth: ")
    console.log(ethers.utils.formatEther(outputAmount2.toString()))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
