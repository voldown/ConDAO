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
  // votingDelay: 1 block 
  // votingPeriod: 273 block == 1 hour
  await deployer.deploy(CondoGovernor, condoToken.address, condoRegistry.address, 1, 273 );
  const condoGovernor = await CondoGovernor.deployed();
};



