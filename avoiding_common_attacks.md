# Security Measures

## Use Modifiers Only for Validations
- modifier `votingValidity()` in `CondoGovernor.sol` checks validity of callers (required to be homeowners with CONDO NFT)

## Proper Use of `require`
- function `safeMint()` in `CondoRegistry.sol` utilizes `require` to limit max supply of CONDO NFT

## Proper Use of `call` Instead of `send`, `transfer`
- function `sendEther()` in `CondoTreasury.sol` utilizes `.call` to send ETH funds