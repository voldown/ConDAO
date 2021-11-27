# ConDAO v0.1

## Deployed Project Demo 
[]()

## Project Installation
### Prerequisites
- Node.js >= v14.17
- NPM >= 6.14
- Yarn >= 1.22
- Truffle & Ganache

### Smart Contract Deployment
- run `npm install`
- run local testnet in port `8545` with `ganache-cli`
- run `truffle migrate --network development` to migrate
- run `truffle test` for testing

### Frontend Deployment
- `cd client`
- under the `/client` folder run `yarn install`
- create `.env` under the `/client` folder and paste in `SKIP_PREFLIGHT_CHECK=true`
- and `yarn start`
- open `http://localhost:3000`

### Screencast on Project Installation and Interaction
[]()

## Project Description

### Keywords Definition

`Apartment/Condo/Complex`
These 3 words will be used interchangeably to refer to [condominium](https://en.wikipedia.org/wiki/Condominium).

`Resident/Homeowner`
For the sake of simplicity, the word '*resident*' here does not neccessarily mean whoever resides within a unit (e.g. a tenant) and only refers to the owner of the property (i.e. homeowner).

### The Problem

Homeowners together share the responsibility of taking care of the condo as a common property. However, often the case is that some of the homeowners would not like to agree with others in terms of certain aspects of the community proposal (e.g maintenance). Instead of relying on some sort of traditional property management intermediaries (e.g [HOA](https://en.wikipedia.org/wiki/Homeowner_association)), which tend to overcharge for fees and has not been proven to be effective or helpful as it is supposed to be, the DAO of Condo Property (ConDAO v0) is introduced here to offer alternative solutions.

---

## Proposed Solution

### Key Features

- Property tokenization
    - `CONDO` NFT: security token (ERC-721)
        - represents ownership of property 
    - `CDT`: governance token (ERC-20)
        - can be extracted as votes for governance voting 
- Property ownership and token transfer
    - Initial transfer: from estate developer to first-hand homeowner
    - Resale transfer: from previous homeowner to next homeowner
- Governance voting
    - check `CONDO` NFT for proposal making/voting/execution validation
    - vote for the proposal with `CDT` weighted as voting power

### High Level User Workflow

- Estate developer
    1. deploys contracts
    2. `CDT`s are 100% preminted to estate developer's address
    3. mints `CONDO` NFT to the homeowner of the sold unit
    4. transfers `CDT` to the homeowner of the sold unit
- Homeowner (condo unit owner)
    1. receives the NFT and `CDT` from estate developer
    2. delegates CDTs as votes to themselves
    3. submits a proposal
    4. votes for a proposal
    5. executes a proposal

### Tech Stack and Toolings

- smart contract development based on OpenZeppelin ERC-20, ERC-721 and Governor contract
- using truffle framework for smart contract development and testing
- using web3.js for smart contract interaction
- storing NFT data via Pinata / IPFS

---

## Future Improvements

- hardcoded demo application -> customizable real-world application
- work on web2 backend to store proposal datas off-chain
- work on tokenomics to improve rationality and incentive mechanism
- access real-world datetime via Chainlink for security purpose
- use real-world price data of ETH/USD via Chainlink to convert fees from eth to usd