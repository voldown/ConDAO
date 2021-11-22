const CondoRegistry = artifacts.require("./CondoRegistry.sol");
const CondoToken = artifacts.require("./CondoToken.sol");
const CondoGovernor = artifacts.require("./CondoGovernor.sol");

module.exports = async function(deployer, network, accounts) {
  // deploy CondoRegistry contract with a cappedSupply of 4
  await deployer.deploy(CondoRegistry, "4");
  const condoRegistry = await CondoRegistry.deployed();

  // deploy CondoToken contract with a cappedSupply of 1000
  await deployer.deploy(CondoToken, "1000");
  const condoToken = await CondoToken.deployed();

  // deploy CondoGovernor contract with CondoToken as ERC20Votes
  // go to https://wizard.openzeppelin.com/#governor for configuration of time in blocks
  /* public testnet voting params configuration
     votingDelay: 1 block == 13.2 seconds
     votingPeriod: 45 block == 10 minutes
  */
  /* local ganache-cli voting params configuration
     votingDelay: 0 block 
     votingPeriod: 3 block
  */
  await deployer.deploy(CondoGovernor, condoToken.address, condoRegistry.address, 0, 3);
  const condoGovernor = await CondoGovernor.deployed();
};
