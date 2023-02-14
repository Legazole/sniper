const { network, getNamedAccounts, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("deploying contract on network")

    const args = []
    const contract = await deploy("Hub", {
        from: deployer,
        log: true,
        args: args,
    })

    log(`contract deployed on address: ${contract.address}`)
    log("-------------------------------------------------")
}

module.exports.tags = ["all", "hub"]
