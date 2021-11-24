// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Condo Treasury Contract
/// @notice collectively owned by homeowners, ETH funds in this contract can only be transferred when proposals are succeeded and executed
contract CondoTreasury is Ownable {

    string private _name;

    event ReceivedEther(address indexed _from, uint256 indexed value);
    event SentEther(address indexed _to, uint256 indexed value);

    /// @param name_ contract name
    constructor(string memory name_) {
        _name = name_;
    }

    /// @return contract name
    function name() public view returns (string memory) {
        return _name;
    }

    /// @return ETH balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    /// @dev can only be called from Condo Governor contract
    /// @param _to target address to send ETH funds to
    /// @param _value ETH funds value
    function sendEther(address payable _to, uint256 _value) public payable onlyOwner {
        (bool sent, ) = _to.call{value: _value}("");
        require(sent, "Failed to send Ether");
        emit SentEther(_to, _value);
    }

    /// @dev receive ETH funds from EOAs
    receive() external payable {
        emit ReceivedEther(msg.sender, msg.value);
    }

    /// @dev receive ETH funds from EOAs
    fallback() external payable {
        emit ReceivedEther(msg.sender, msg.value);
    }
}
