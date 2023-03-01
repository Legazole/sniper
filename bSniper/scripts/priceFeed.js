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
     Provider / Signer
     Network variables
    */

    const chainId = ChainId.MAINNET
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.MAINNET_RPC_URL
    )

    /*
     ABI's
     */

    const UNI_ROUTER_ABI = [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
        "function WETH() external pure returns (address)",
    ]
    const IERC20_ABI = [
        "function name() public view returns (string)",
        "function symbol() public view returns (string)",
        "function decimals() public view returns (uint8)",
        "function totalSupply() public view returns (uint256)",
        "function balanceOf(address _owner) public view returns (uint256 balance)",
        "function transfer(address _to, uint256 _value) public returns (bool success)",
        "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
        "function approve(address _spender, uint256 _value) public returns (bool success)",
        "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
    ]

    /*
     Addressess
    */

    const UNI_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const LINK_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    let addressA, wethAddress

    /*
     Contracts
    */

    const uniRouter = new ethers.Contract(
        UNI_ROUTER_ADDRESS,
        UNI_ROUTER_ABI,
        provider
    )

    //start of functions

    wethAddress = await uniRouter.WETH()

    //const tokenA = new ethers.Contract(addressA, IERC20_ABI, provider)
    const wethERC20Contract = new ethers.Contract(
        wethAddress,
        IERC20_ABI,
        provider
    )
    const usdc = await Fetcher.fetchTokenData(chainId, USDC_ADDRESS, provider)
    const link = await Fetcher.fetchTokenData(chainId, LINK_ADDRESS, provider)
    const pair1 = await Fetcher.fetchPairData(usdc, WETH[chainId], provider)

    const routeAToB = new Route([pair1], WETH[usdc.chainId])
    const trade1 = new Trade(
        routeAToB,
        new TokenAmount(WETH[usdc.chainId], ethers.utils.parseEther("1")),
        TradeType.EXACT_INPUT
    )

    console.log("***********************")
    console.log("Price feed")
    console.log("***********************")
    console.log(`Current blocknumber: ${await provider.getBlockNumber()}`)
    console.log(
        `Checking price of one 1 ${await wethERC20Contract.name()} in usdc\n${trade1.executionPrice.toSignificant(
            6
        )}`
    )

    //calculate execution price for one usdc
    console.log("how much does 1 USDC buy us?")
    //console.log(`${trade1.executionPrice.invert().toSignificant(6)}`)
    const aToB = trade1.executionPrice.invert().toSignificant(6)
    console.log(aToB)
    //now we know how much eth we can buy with 1 usdc
    //we can use this amount as trade input into another coin (C)
    //example third coin = link
    const pair2 = await Fetcher.fetchPairData(link, usdc, provider)
    const routeBToC = new Route([pair2], usdc)
    const tradeWithAToBAmount = new Trade(
        routeBToC,
        aToB,
        TradeType.EXACT_INPUT
    )
    const trade2 = new Trade(
        routeBToC,
        new TokenAmount(usdc, ethers.utils.parseEther("1")),
        TradeType.EXACT_INPUT
    )
    console.log("Trade output when we use the input from the previous trade")
    console.log(tradeWithAToBAmount.executionPrice.toSignificant(6))
    console.log("Trade output when we want to trade 1 usdc for link")
    console.log(trade2.executionPrice.toSignificant(6))
    //we can then check how much
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
