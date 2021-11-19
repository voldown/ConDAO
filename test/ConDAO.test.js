const { assert } = require('chai');

const CondoRegistry = artifacts.require('CondoRegistry');
const CondoToken = artifacts.require('CondoToken');
const CondoGovernor = artifacts.require('CondoGovernor');

contract('CondoRegistry', ([developer, unit1_owner, new_unit1_owner]) => {
    let condoRegistry;
    let condoToken;

    // convert ether to wei (helper function)
    function etherToWei(n) {
        return web3.utils.toWei(n, 'ether');
    }

    before(async () => {
    // load Contracts (CondoRegistry.sol and CondoToken.sol)
        condoRegistry = await CondoRegistry.new("4");
        condoToken = await CondoToken.new("1000");

    // mint a condo_unit NFT to a condo_unit_owner
        await condoRegistry.safeMint(unit1_owner, '1', 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
    })

    // check Condo Registry Deployment
    describe('Condo Registry Deployment', async () => {
        it('contract has a name', async () => {
            const name = await condoRegistry.name();
            assert.equal(name, 'CondoRegistry');
        })

        it('contract has a symbol', async () => {
            const symbol = await condoRegistry.symbol();
            assert.equal(symbol, 'CONDO');
        })

        it('contract has a totalSupply of 1', async () => {
            const totalSupply = await condoRegistry.totalSupply();
            assert.equal(totalSupply, '1');
        })


        it('contract has a maxTotalSupply of 4', async () => {
            const maxTotalSupply = await condoRegistry.maxTotalSupply();
            assert.equal(maxTotalSupply, '4');
        })
    })

    // check Condo Token Deployment
    describe('Condo Token Deployment', async () => {
        it('contract has a name', async () => {
            const name = await condoToken.name();
            assert.equal(name, 'CondoToken');
        })

        it('contract has a symbol', async () => {
            const symbol = await condoToken.symbol();
            assert.equal(symbol, 'CDT');
        })
    })

    // check if CDT has been preminted to condo_whole_developer when the contract was deployed
    describe('Premint Condo Token (CDT)', async () => {
        it('developer has all the CDT token', async () => {
            let totalSupply = await condoToken.totalSupply().then(ts => ts.toString());
            let balanceOfDeveloper = await condoToken.balanceOf(developer).then(bl => bl.toString());
            assert.equal(totalSupply, balanceOfDeveloper);
        })
    })

    // check if NFTs has been minted to corresponding addresses
    describe('Mint Condo Unit NFTs', async () => {
        let ownerAddress;
        let tokenURI;

        it('unit1_owner has the condo_unit NFT with tokenId=1', async () => {
            ownerAddress = await condoRegistry.ownerOf(1);
            tokenURI = await condoRegistry.tokenURI(1);
            assert.equal(ownerAddress, unit1_owner);
            assert.equal(tokenURI, 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
        })
    })

    // check if CDT can be properly transferred
    describe('Transfer CDT', async () => {
        let balanceOf;
        it('developer has successfully transferred 100 CDT to unit1_owner', async () => {
            await condoToken.transfer(unit1_owner, etherToWei('100'));
            balanceOf = await condoToken.balanceOf(unit1_owner);
            assert.equal(balanceOf, etherToWei('100'));
        })

        it('unit1_owner has successfully transferred 100 CDT to new_unit1_owner', async () => {
            await condoToken.transfer(new_unit1_owner, etherToWei('100'), {from:unit1_owner});
            balanceOf = await condoToken.balanceOf(new_unit1_owner);
            assert.equal(balanceOf, etherToWei('100'));
        })
    })

    // check if condo_unit NFT can be transferred by current homeowner to next homeowner
    describe('Transfer Condo Unit NFT', async () => {
        it('unit1_owner has successfully transferred the condo_unit NFT to new_unit1_owner', async () => {
            await condoRegistry.safeTransferFrom(unit1_owner, new_unit1_owner, 1, {from:unit1_owner});
            let ownerAddress = await condoRegistry.ownerOf(1);
            assert.equal(ownerAddress, new_unit1_owner);
        })
    })

})

contract('CondoGovernor', ([developer, unit1_owner, unit2_owner, unit3_owner, unit4_owner, property_maintenance]) => {
    let condoRegistry;
    let condoToken;
    let condoGovernor;

    // convert ether to wei (helper function)
    function etherToWei(n) {
        return web3.utils.toWei(n, 'ether');
    }

    before(async () => {
    // load Contracts (CondoRegistry.sol , CondoToken.sol and CondoGovernor.sol)
        condoRegistry = await CondoRegistry.new("4");
        condoToken = await CondoToken.new("1000");
        condoGovernor = await CondoGovernor.new(condoToken.address, condoRegistry.address);

    // mint condo unit NFTs to condo unit owners
        await condoRegistry.safeMint(unit1_owner, '1', 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
        await condoRegistry.safeMint(unit2_owner, '2', 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
        await condoRegistry.safeMint(unit3_owner, '3', 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');
        await condoRegistry.safeMint(unit4_owner, '4', 'ipfs://QmV9y7NeumwkRJw2zK2NtUAAqU8qTPqH8nySnJ56qF7ZCn');

    // transfer CDTs to condo unit owners
        await condoToken.transfer(unit1_owner, etherToWei('250'));
        await condoToken.transfer(unit2_owner, etherToWei('250'));
        await condoToken.transfer(unit3_owner, etherToWei('250'));
        await condoToken.transfer(unit4_owner, etherToWei('250'));
    })

    // check Condo Governor Deployment
    describe('Condo Governor Deployment', async () => {
        it('contract has a name', async () => {
            const name = await condoGovernor.name();
            assert.equal(name, 'CondoGovernor');
        })

        it('contract has condoToken as the ERC20Votes token', async () => {
            const token = await condoGovernor.token();
            assert.equal(token, condoToken.address);
        })
    })

    // check Condo Treasury Deployment
    describe('Condo Treasury Deployment', async () => {
        it('contract has a name', async () => {
            const name = await condoGovernor.treasuryName();
            assert.equal(name, 'CondoTreasury');
        })

        it('contract has an address', async () => {
            const address = await condoGovernor.treasury();
            const addressPrefix = address.slice(0,2);
            assert.typeOf(address, 'string');
            assert.equal(addressPrefix, '0x');
            assert.lengthOf(address, 42);
        })

        it('contract has a initial ETH balance of 0', async () => {
            const balanceOf = await condoGovernor.treasuryBalance();
            assert.equal(balanceOf, etherToWei('0'));
        })
    })

    // check if Condo Treasury can receive ETH funds from condo unit owners
    describe('Send ETH to Condo Treasury', async () => {
        it('unit1_owner has successfully sent 1 ETH to Condo Treasury' , async () => {
            const treasuryAddress = await condoGovernor.treasury();
            const amount = etherToWei('1');
            await web3.eth.sendTransaction({from: unit1_owner, to: treasuryAddress, value: amount});
            const balanceOf = await condoGovernor.treasuryBalance();
            assert.equal(balanceOf, amount);
        })
    })

    // check if proposal can be made and voted for
    describe('Condo Unit Owners Propose, Vote', async () => {
        let proposalId;
        let proposeResult;

        // unit1_owner make a proposal
        it('unit1_owner has successfully made a proposal on transfer 1 ETH from Condo Treasury to property maintenance', async () => {
            const treasuryAddress = await condoGovernor.treasury();
            const sendEthCalldata = await web3.eth.abi.encodeFunctionCall({
                name: 'sendEther',
                type: 'function',
                inputs: [{
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                }]
            }, [property_maintenance]);
            proposeResult = await condoGovernor.propose(
                [treasuryAddress],
                [1],
                [sendEthCalldata],
                "Proposal #1: Send 1 ETH to property maintenance",
                { from: unit1_owner }
            );
            proposalId = proposeResult.logs[0].args.proposalId.toString();
            let txHash = proposeResult.tx;
            assert.typeOf(txHash, 'string');
            assert.equal(txHash.slice(0,2), '0x');
            assert.lengthOf(txHash, 66);
        })

        // dummy transaction to increase the blockheight by 1
        it('increase the blockheight by 1 so that condo unit owner can cast vote on the proposal', async () => {
            const treasuryAddress = await condoGovernor.treasury();
            const amount = etherToWei('1');
            await web3.eth.sendTransaction({from: unit2_owner, to: treasuryAddress, value: amount});
        })

        // unit2_owner cast a vote on the proposal
        it('unit2_owner has successfully cast a vote on the proposal above', async () => {
            let castResult = await condoGovernor.castVote(proposalId, 1, { from: unit2_owner });
            let support = castResult.logs[0].args.support.toString();
            let txHash = castResult.tx;
            assert.typeOf(txHash, 'string');
            assert.equal(txHash.slice(0,2), '0x');
            assert.lengthOf(txHash, 66);
            assert.equal(support, '1');
        })

        // execute part
        
    })


})















