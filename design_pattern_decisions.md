# Design Patterns

## Inheritance and Interfaces
- Using OpenZeppelin ERC-721, ERC-20 and Governor contracts as a base for following contracts
        - `CondoRegistry.sol`
        - `CondoToken.sol`
        - `CondoGovernor.sol`

## Access Control Design Patterns
- Using `onlyOwner` to limit critical functions like `safeMint()` , `sendEther()` being accessed by anyone except the contract `owner`

## Inter-Contract Execution
- When `CondoGovernor` is being deployed,  `condoToken.address` and `condoRegistry.address` are required as parameters where `CondoToken` is used as `ERC20Votes` and `CondoRegistry` is used for validation of accessing certain functions like `propose()`, `castVote()` and `execute()` in `CondoGovernor`
- `CondoTreasury` gets deployed when `CondoGovernor` is deployed
- function `sendEther()` in `CondoTreasury.sol` can only be called from `CondoGovernor.sol`

    