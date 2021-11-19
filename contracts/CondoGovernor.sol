// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./CondoRegistry.sol";
import "./CondoTreasury.sol";

contract CondoGovernor is Governor, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {

    uint256 private _votingDelay;    
    uint256 private _votingPeriod;    
    CondoRegistry public condoRegistry;
    CondoTreasury public condoTreasury;

    event CreatedCondoTreasury(address indexed condoTreasury);

    // check if the propose/vote address has the NFT 
    modifier votingValidity() {
        require(condoRegistry.balanceOf(tx.origin)>0, "only condo unit owners can propose/vote for governance");
        _;
    }

    constructor(ERC20Votes _token, CondoRegistry _condoRegistry, uint256 votingDelay_, uint256 votingPeriod_)
        Governor("CondoGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(66)
    {
        condoRegistry = _condoRegistry;
        condoTreasury = new CondoTreasury("CondoTreasury");
        emit CreatedCondoTreasury(address(condoTreasury));
        _votingDelay = votingDelay_;
        _votingPeriod = votingPeriod_;
    }

    function treasury() public view returns (address) {
        return address(condoTreasury);
    }

    function treasuryName() public view returns (string memory) {
        return condoTreasury.name();
    }

    function treasuryBalance() public view returns (uint256) {
        return condoTreasury.getBalance();
    }

    /// @dev go to https://wizard.openzeppelin.com/#governor for configuration of time in blocks
    function votingDelay() public view override(IGovernor) returns (uint256) {
        return _votingDelay; 
    }

    /// @dev go to https://wizard.openzeppelin.com/#governor for configuration of time in blocks
    function votingPeriod() public view override(IGovernor) returns (uint256) {
        return _votingPeriod;
    }

    // overriding with modifier votingValidity()
    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    // overriding with modifier votingValidity()
    function castVote(uint256 proposalId, uint8 support)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.castVote(proposalId, support);
    }

    // overriding with modifier votingValidity()
    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.castVoteWithReason(proposalId, support, reason);
    }

    // overriding with modifier votingValidity()
    function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.castVoteBySig(proposalId, support, v, r, s);
    }

    // overriding with modifier votingValidity() 
    function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        public
        payable
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.execute(targets, values, calldatas, descriptionHash);
    }

    // The following functions are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }
}

