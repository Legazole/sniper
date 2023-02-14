const { network, getNamedAccounts, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("deploying  test contract on network")

    const args = []
    const contract = await deploy("TestERC20", {
        from: deployer,
        log: true,
        args: args,
    })

    log(`test contract deployed on address: ${contract.address}`)
    log("-------------------------------------------------")
}

module.exports.tags = ["all", "testerc20"]
