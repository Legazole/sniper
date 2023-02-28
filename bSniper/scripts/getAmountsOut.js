const { getNamedAccounts, ethers } = require("hardhat")
require("dotenv").config()

async function main() {
    const { deployer } = await getNamedAccounts()

    const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

    const UNISWAP_V2_ROUTER_ADDRESS =
        "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
    const UNISWAP_V2_ABI = [
        "function getAmountsOut(uint amountIn,address[] memory path) internal view returns(uint[] memory amounts)",
    ]

    const uniRouter = new ethers.Contract(
        UNISWAP_V2_ROUTER_ADDRESS,
        UNISWAP_V2_ABI,
        ethers.provider
    )

    let amountEthFromDAI = await uniRouter.getAmountsOut(
        ethers.utils.parseEther("50000"),
        [DAI_ADDRESS, WETH_ADDRESS]
    )

    console.log("Amount of ETH from DAI: ", amountEthFromDAI[1].toString())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
