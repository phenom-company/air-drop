const StandardToken = artifacts.require("StandardToken");
const MintableToken = artifacts.require("MintableToken");
const TokenCreator = artifacts.require("TokenCreator");
const config = require('./config.json');

const name = config.name;
const symbol = config.symbol;
const decimals = config.decimals;
const totalSupply = config.totalSupply;
const transferable = config.transferable;

module.exports = function(deployer, network) {
	  if (network == "rinkeby") {
    	 	deployer.deploy([
		 	TokenCreator
		 	]);
	  } else {
	    deployer.deploy([
			[StandardToken, name, symbol, decimals, totalSupply, transferable, {overwrite: false}],
			[MintableToken, name, symbol, decimals, transferable, {overwrite: false}],
			TokenCreator
			]);
	  }
};
