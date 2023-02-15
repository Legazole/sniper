// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Hub is Ownable {
    //IERC20 Tokens
    IERC20 public token;
    IERC20 public constant WETH =
        IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    //Uni variables
    address private constant FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Factory uniFactory = IUniswapV2Factory(FACTORY);
    IUniswapV2Router02 uniRouter = IUniswapV2Router02(ROUTER);

    mapping(address => uint) public userValueStored;
    address[] public users;

    constructor() {}

    //although we can use a set function to check a pair and use the corresponding features of a pair after to check the values
    //storing a variable to the blockchain costs gas, thus meaning that each time you want to initialize another pair it'll cost you gas

    //we call this function with an amount to borrow and which token
    // => arbitrage oppertunity on sushiswap token X has a pirce difference from uniswap

    /*
    function flashSwap(uint _amount, address _token) external view onlyOwner {
        //first step is we check if a pair for tokenX exists to lend from
        address pair = uniFactory.getPair(_token, WETH);
        uint amountOut = uniRouter.getAmountsOut(_amount, path[]);
        require(_amount > amountOut);
    }
    */
    function fund() public payable {
        userValueStored[msg.sender] += msg.value;
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == msg.sender) {
                break;
            } else {
                users.push(msg.sender);
            }
        }
    }

    function setERC20(address _token) external {
        token = IERC20(_token);
    }

    function checkERC20BalanceOfAddress(
        address _address
    ) external view returns (uint256) {
        return token.balanceOf(_address);
    }

    function checkContractWETHBalance() external view returns (uint) {
        return WETH.balanceOf(address(this));
    }

    function getIERC20Addressess()
        external
        view
        returns (address _weth, address _token)
    {
        return (address(WETH), address(token));
    }

    receive() external payable {
        fund();
    }
}
