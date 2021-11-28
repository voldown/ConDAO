# Security Measures

## Proper Setting of Function Visibility (SWC-100)
- functions in the contracts are properly specified as being `public`, `external`, `internal` and `private`

## Call Return Value is Checked (SWC-104)
- return value of `.call()` in function `sendEther()` in `CondoTreasury.sol` is checked with `require`

## Use Modifiers Only for Validations
- modifier `votingValidity()` in `CondoGovernor.sol` checks validity of callers (required to be homeowners with CONDO NFT)

## Proper Use of `require`
- function `safeMint()` in `CondoRegistry.sol` utilizes `require` to limit max supply of CONDO NFT

## Proper Use of `call` Instead of `send`, `transfer`
- function `sendEther()` in `CondoTreasury.sol` utilizes `.call` to send ETH funds

