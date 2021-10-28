# ConDAO v0

## Project Discription

### Keywords Definition

`Apartment/Condo/Complex`
These 3 words will be used interchangeably to refer to [condominium](https://en.wikipedia.org/wiki/Condominium).

`Resident/Homeowner`
For the sake of simplicity, the word '*resident*' here does not neccessarily mean whoever resides within a unit (e.g. a tenant) and only refers to the owner of the property (i.e. homeowner).

### Background

As a urban resident, living in a apartment/condo/complex unit is very common nowadays, especially in the highly-populated region of the major cities in the world. While undoubtedly there is a considerable amount of benefits living in a condo unit, homeowners together share the responsibility of taking care of their common property. However, often the case is that some of the homeowners would not like to agree with others in terms of certain aspects of the community proposal (e.g maintenance). Just imagine some of the following real-life cases:

Case 1: The reinforced concrete of the building has reached its life expectancy, thus in need of further consolidation to extend the durability and sustainability of the building. Alice, who recently purchased a unit of the condo from the previous homeowner Bob and has just moved in, feels unfair that she has to pay for such a huge amount of maintenance cost even though it is shared equally.

Case 2: An elevator within a 20-storey block fails to work properly and requires to be replaced by a new one. Homeowners from higher floors urge to have it fixed as soon as possible, while those from lower floors do not really care and would not like to pay for the maintenance cost that would be equally shared.

Case 3: Due to the pandemic situation, some of the homeowners believe that measures should be taken to improve sanitary conditions of the public area of the building, and would like to have a nice discussion with other homeowners on what exactly the measure should be and how to cover the cost in details.

Instead of relying on some sort of traditional property management intermediaries (e.g [HOA](https://en.wikipedia.org/wiki/Homeowner_association)), which tend to overcharge for fees and has not been proven to be effective or helpful as it is supposed to be, the DAO of Condo Property (ConDAO v0) is introduced here to offer alternative solutions.

---

## Proposed Solution

### Key Features

- Property tokenization
    - NFT: security token (ERC-721)
    - FTs: governance token (ERC-20)
- Property ownership transfer
    - Initial transfer: from estate developer to first-hand homeowner
    - Resale transfer: from previous homeowner to next homeowner
- Issue submission
    - stake governance token to submit a proposal
- Governance voting
    - check NFT for voting qualification
    - vote for the proposal with FTs

### High Level User Workflow

- Estate developer
    - registers the whole condo property as an NFT
    - mints NFT and FTs for each of the units
        - NFT (represents the ownership of the property)
        - FT (used as votes for governance voting)
    - transfers the corresponding NFT and a certain amount of FTs to the homeowner of the sold unit
    - submits initial proposal for condo fees
        - sets condo fee to 0.1 ether
        - each address of the units has to deposit the condo fee monthly on every 1st
- Homeowner
    - receives the NFT and FTs from the estate developer
    - votes for the initial proposal
    - once the voting period is over, FTs will be transfered to the treasury address

### Tech Stack and Toolings

- smart contract development based on OpenZeppelin ERC-20, ERC-721 and Governor contract
- smart contract automation via OpenZeppelin Defender
- storing NFT data via Pinata / IPFS

---

## Future Improvements & TBDs

- hardcoded demo application -> customizable real-world application
- work on tokenomics to improve rationality and incentive mechanism
- access real-world datetime via Chainlink for security purpose
- use real-world price data of ETH/USD to automatically convert monthly condo fees from eth to usd