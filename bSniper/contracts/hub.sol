// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Hub {
    IERC20 public token;
    IERC20 public constant WETH =
        IERC20(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6);

    mapping(address => uint) public userValueStored;
    address[] public users;

    //A function where we can check the reservers for an account for a token

    constructor() {}

    //although we can use a set function to check a pair and use the corresponding features of a pair after to check the values
    //storing a variable to the blockchain costs gas, thus meaning that each time you want to initialize another pair it'll cost you gas

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

    function checkAddressWETHBalance(
        address _address
    ) external view returns (uint) {
        return WETH.balanceOf(_address);
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
