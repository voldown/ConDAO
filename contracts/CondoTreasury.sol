// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CondoTreasury is Ownable {

    string private _name;

    event ReceivedEther(address indexed _from, uint256 indexed value);
    event SentEther(address indexed _to, uint256 indexed value);

    constructor(string memory name_) {
        _name = name_;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendEther(address payable _to, uint256 _value) public payable onlyOwner {
        (bool sent, ) = _to.call{value: _value}("");
        require(sent, "Failed to send Ether");
        emit SentEther(_to, _value);
    }

    receive() external payable {
        emit ReceivedEther(msg.sender, msg.value);
    }

    fallback() external payable {
        emit ReceivedEther(msg.sender, msg.value);
    }
}
