const { ethers, getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")
const { deployments } = require("hardhat")

describe("Hub functionality", function () {
    let deployer, hub, wethContract

    const wethTokenAddress = 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    const wethABI = ["function balanceOf(address) view returns (uint);"]

    beforeEach(async function () {
        //get the signer via getNamedAccountsFunction()
        deployer = (await getNamedAccounts()).deployer

        //get contracts here using deployments functionality
        await deployments.fixture(["all"])
        hub = await ethers.getContract("Hub", deployer)
        testERC20 = await ethers.getContract("TestERC20", deployer)
        //
    })
    describe("Initialized variables", async function () {
        it("Should compare weth token address", async function () {
            let expectedValue = wethTokenAddress
            let [actualValue] = await hub.getIERC20Addressess()
            assert.equal(expectedValue, actualValue)
        })
    })
    describe("Functions", async function () {
        it("setERC20 function", async function () {
            let expectedValue = testERC20.address
            await hub.setERC20(testERC20.address)
            let [, actualValue] = await hub.getIERC20Addressess()
            assert.equal(expectedValue, actualValue)
        })
        /*
        it("checkAddressWETHBalance function", async function () {
            wethContract = new ethers.Contract(
                wethTokenAddress,
                wethABI,
                deployer
            )
            let expectedValue = await wethContract.balanceOf(hub.address)
            let actualValue = await hub.checkAddressWETHBalance()
            assert.equal(expectedValue, actualValue)
        })
        */
    })
})
