// SPDX-License-Identifier: MIT
pragma solidity =0.6.6;

import "@uniswap/v2-periphery/contracts/UniswapV2Router01.sol";

contract UniswapHelper {
    //Contract is redundant, we will use the existing router contract for price quota
    /*
        Addressess


        address private constant ROUTER_ADDRESS;
        address private constant FACTORY_ADDRESS;
    */
    /*
        Initialized Contracts

        UniswapV2Router01 uniRouter = UniswapV2Router01(ROUTER_ADDRESS);
    */
    /*
        Trade parameters
    */
    /*
    uint inputAmountTrade = 1;
     address[] memory path;
    path = new address[](2);
    path[0] = ; //First token in trade - From token
    path[1] = ; //second token in trade - To token
    */
    /*
    function checkExecutionPrice(
    ) returns(uint[] memory){
        return uniRouter.getAmountOut(FACTORY_ADDRESS,inputAmountTrade,path)
    }
    */
}
