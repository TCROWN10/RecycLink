// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CreditToken is ERC20 {
    address private i_owner;
    address public depositorAddress;
    uint initialSupply;

    constructor() ERC20("CREDIT Token", "CRDT") {
    }

    function mint(
        address userAccount,
        uint256 amountToMint
    ) external {
        _mint(userAccount, amountToMint);
    }

    function burn(
        address userAccount,
        uint256 amountToBurn
    ) external {
        _burn(userAccount, amountToBurn);
    }
}