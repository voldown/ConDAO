# ConDAO v0.1

## Project Demo

### Ropsten Deployed React App
[https://condao-project.vercel.app/](https://condao-project.vercel.app/)
- due to the strict access control of the app, the demo app above can only be accessed via certain wallet addresses
- please install this project locally following the instructions for interaction purpose

### Demo Walkthrough Video
[https://youtu.be/U6djzW6sOnQ](https://youtu.be/U6djzW6sOnQ)

### Ethereum Address For Certification
- ens: voldown.eth
- address: 0x193150500c8FbA12383ea5a11C9082C9Fede1B1C

---

## Project Description

### About ConDAO
Homeowners together share the responsibility of taking care of the condo as a common property. However, often the case is that some of the homeowners would not like to agree with others in terms of certain aspects of the community proposal (e.g maintenance). Instead of relying on some sort of traditional property management intermediaries (e.g [HOA](https://en.wikipedia.org/wiki/Homeowner_association)), which tend to overcharge for fees and has not been proven to be effective or helpful as it is supposed to be, the DAO of Condo Property (ConDAO v0) is introduced here to offer alternative solutions.

### Key Features
- property tokenization
    - `CONDO` NFT: security token (ERC-721)
        - represents ownership of property 
    - `CDT`: governance token (ERC-20)
        - can be extracted as votes for governance voting 
- property ownership and token transfer
    - initial transfer: from estate developer to first-hand homeowner
    - resale transfer: from previous homeowner to next homeowner
- governance voting
    - check `CONDO` NFT for proposal making/voting/execution validation
    - vote for the proposal with `CDT` weighted as voting power

### High Level User Workflow
- estate developer
    1. deploys contracts
    2. `CDT`s are 100% preminted to estate developer's address
    3. mints `CONDO` NFT to the homeowner of the sold unit
    4. transfers `CDT` to the homeowner of the sold unit
- homeowner (condo unit owner)
    1. receives the corresponding `CONDO` NFT and certain amount of `CDT` from estate developer
    2. delegates CDTs as votes to themselves
    3. submits a proposal
    4. votes for a proposal
    5. executes a proposal

### Tech Stack and Toolings
- smart contract development based on OpenZeppelin ERC-20, ERC-721 and Governor contract
- using truffle framework for smart contract development and testing
- using create-react-app and web3.js for frontend interaction

### Directory Structure
- `client`: react frontend of the project
- `contracts`: smart contracts
- `migrations`: migration files for deploying contracts
- `test`: tests for smart contracts

---

## Project Installation

### Prerequisites
- node.js >= v14.17
- npm >= 6.14
- yarn >= 1.22
- truffle & ganache
- `git checkout main`

### Smart Contract
- `npm install`
- run local testnet in port `8545` with `ganache-cli`
- `truffle migrate --network development` to migrate
- `truffle test` for testing

### Frontend Client
- `cd client`
- `yarn install`
- `cat >> .env` and paste in `SKIP_PREFLIGHT_CHECK=true` and press CTRL+D to save and exit
- `yarn start`
- open `http://localhost:3000`
- switch metamask network to GANACHE-CLI
    - RPC URL: `http://127.0.0.1:8545`
    - Chain ID: `1337`

### Interaction Workflow
1. import wallet addresses from ganache-cli to metamask, switch network and preparation
    - accounts(0) is the estate developer's address (contract owner)
        - `CONDO` NFT can only be minted by the estate developer (contract owner)
        - a total supply of 1000 CDT are preminted to the address
    - accounts(1-4) can be used as unit owners' addresses
    - transfer 10 ETH fund to the condo treasury address as initial treasury funds
        - treasury funds can only be transferred via succeeded proposal execution 
2. mint `CONDO` NFT and transfer `CDT` from estate developer's address to the unit owners
    - each of the unit owners should receive a `CONDO` NFT with a token ID representing their unit number (1-4)
        - e.g unit#1 owner should receive a `CONDO` NFT with a token ID being `1`
    - each of the unit owners should equally receive 250 `CDT` for a fair token distribution
3. delegate votes to themselves from each of the unit owners' address
    - `CDT` will only be counted as votes after delegation
    - each of the unit owners should delegate votes to themselves
4. make a proposal on community issues from one of the unit owners' address
    - e.g. voluntarily work as a gardener of the property last month, unit#1 owner made a proposal on having 0.5 ETH as a reward
        - `project description` should be a string
        - `address` refers to the address of unit#1 owner, which is going to receive ETH funds from the treasury address
        - `value` refers to the ETH funds that unit#1 owner is proposed to be receive
    - after submitting a proposal, copy and save the proposal ID from the alert box as it is needed later
5. cast a vote on the proposal from other unit owners' address
    - in order to have a proposal succeeded and executed, other 3 unit owners should vote `FOR` the proposal
    - since ganache-cli will not automatically create blocks without sending transactions, in case proposal state stays `ACTIVE`, manually sending dummy transactions would increase the block height and proposal state would get updated to `SUCCEEDED`
6. execute the proposal from a unit owner
    - `project description`, `address` and `value` should be exactly the same as the original input data of the proposal
    - if the proposal is executed successfully, ETH balance of unit#1 owner's account should increase by 0.5 ETH while the balance of treasury address should decrease by 0.5 ETH

---

## Future Improvements
- hardcoded demo application -> customizable real-world application
- improve frontend user experience by refactoring react code
- work on web2 backend to store proposal datas off-chain
- work on tokenomics to improve rationality and incentive mechanism
- access real-world datetime via Chainlink for security purpose
- use real-world price data of ETH/USD via Chainlink to convert fees from eth to usd