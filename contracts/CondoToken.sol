// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Condo Token(CDT) Contract 
/// @notice Condo Token(CDT) used as votes for governance voting
/// @dev Currently hardcoded total supply will be customizable in the future development build
contract CondoToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(uint256 maxTotalSupply) ERC20("CondoToken", "CDT") ERC20Permit("CondoToken") {
        // premint tokens with a cappedSupply to estateDeveloper
        _mint(msg.sender, maxTotalSupply * 10 ** decimals());
    }
    
    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}