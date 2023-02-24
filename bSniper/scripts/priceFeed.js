const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    //we start anew seeing that my ubuntu distro is dead, need to remove the partition
    //make a new bigger partition for dev purposes
    //small test
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })