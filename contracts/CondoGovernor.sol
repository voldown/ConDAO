// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./CondoRegistry.sol";
import "./CondoTreasury.sol";

/// @title Condo Governor Contract
/// @notice homeowners can interact with the contract to make proposals, cast votes and execute proposals 
contract CondoGovernor is Governor, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {

    uint256 private _votingDelay;    
    uint256 private _votingPeriod;    
    CondoRegistry public condoRegistry;
    CondoTreasury public condoTreasury;

    event CreatedCondoTreasury(address indexed condoTreasury);

    /// @dev only homeowners with a CONDO NFT will be able to propose, vote, and execute
    modifier votingValidity() {
        require(condoRegistry.balanceOf(tx.origin)>0, "only condo unit owners can propose/vote for governance");
        _;
    }

    /// @dev CondoTreasury contract instance is created when contract is deployed 
    /// @param _token ERC20 token as votes
    /// @param _condoRegistry condoRegistry contract
    /// @param votingDelay_ delay, in number of block, between the proposal is created and the vote starts
    /// @param votingPeriod_ delay, in number of blocks, between the vote start and vote ends
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

    /// @return condoTreasury contract address
    function treasury() public view returns (address) {
        return address(condoTreasury);
    }

    /// @return condoTreasury contract name
    function treasuryName() public view returns (string memory) {
        return condoTreasury.name();
    }

    /// @return condoTreasury contract ETH balance
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

    /// @param targets target contract address to call
    /// @param values ETH value sent along
    /// @param calldatas calldata of function call
    /// @param description proposal description
    /// @dev overriding with modifier votingValidity()
    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    /// @param proposalId proposal ID
    /// @param support vote options: 0 = against, 1 = for, 2 = abstain
    /// @dev overriding with modifier votingValidity()
    function castVote(uint256 proposalId, uint8 support)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.castVote(proposalId, support);
    }

    /// @param proposalId proposal ID
    /// @param support vote options: 0 = against, 1 = for, 2 = abstain
    /// @dev overriding with modifier votingValidity()
    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.castVoteWithReason(proposalId, support, reason);
    }

    /// @param proposalId proposal ID
    /// @param support vote options: 0 = against, 1 = for, 2 = abstain
    /// @dev overriding with modifier votingValidity()
    function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s)
        public
        override(Governor)
        votingValidity
        returns (uint256)
    {
        return super.castVoteBySig(proposalId, support, v, r, s);
    }

    /// @param targets targeted contract address to call
    /// @param values ETH value sent along
    /// @param calldatas calldata of function call
    /// @param descriptionHash keccak256 hash form of description
    /// @dev overriding with modifier votingValidity() 
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

