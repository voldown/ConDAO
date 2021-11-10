const CondoRegistry = artifacts.require("./CondoRegistry.sol");
const CondoToken = artifacts.require("./CondoToken.sol");

module.exports = function(deployer) {
  deployer.deploy(CondoRegistry);
  deployer.deploy(CondoToken);
};



