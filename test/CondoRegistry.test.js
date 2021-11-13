const { assert } = require('chai');

const CondoRegistry = artifacts.require('CondoRegistry');
const CondoToken = artifacts.require('CondoToken');

contract('CondoRegistry', ([developer, unit1_owner, new_unit1_owner]) => {
    let condoRegistry;
    let condoToken;

    // convert ether to wei (helper function)
    function tokens(n) {
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
            await condoToken.transfer(unit1_owner, tokens('100'));
            balanceOf = await condoToken.balanceOf(unit1_owner);
            assert.equal(balanceOf, tokens('100'));
        })

        it('unit1_owner has successfully transferred 100 CDT to new_unit1_owner', async () => {
            await condoToken.transfer(new_unit1_owner, tokens('100'), {from:unit1_owner});
            balanceOf = await condoToken.balanceOf(new_unit1_owner);
            assert.equal(balanceOf, tokens('100'));
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
