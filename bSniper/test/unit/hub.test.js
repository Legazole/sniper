const { ethers, getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")
const { deployments } = require("hardhat")

describe("Hub functionality", function () {
    let deployer, hub
    beforeEach(async function () {
        //get the signer via getNamedAccountsFunction()
        deployer = (await getNamedAccounts()).deployer

        //get contracts here using deployments functionality
        await deployments.fixture(["all"])
        hub = await ethers.getContract("Hub", deployer)
    })
    describe("Initialized variables", async function () {
        let wethTokenAddress = 0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6
        it("Should compare weth token address", async function () {
            let expectedValue = wethTokenAddress
            let [actualValue] = await hub.getIERC20Addressess()
            assert.equal(expectedValue, actualValue)
        })
    })
    describe("Functions", async function () {
        it("setERC20 function", async function () {
            let testAddress = 0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6
            let expectedValue = testAddress
            await hub.setERC20(testAddress)
            let [, actualValue] = await hub.getIERC20Addressess()
            assert.equal(expectedValue, actualValue)
        })
    })
})
