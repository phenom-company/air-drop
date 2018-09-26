const StandardToken = artifacts.require("StandardToken");
const MintableToken = artifacts.require("MintableToken");
const TokenCreator = artifacts.require("TokenCreator");
const config = require('./config.json');

const nameOfToken = config.nameOfToken;
const symbolOfToken = config.symbolOfToken;
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
			[StandardToken, nameOfToken, symbolOfToken, decimals, totalSupply, transferable, {overwrite: false}],
			[MintableToken, nameOfToken, symbolOfToken, decimals, transferable, {overwrite: false}],
			TokenCreator
			]);
	  }
};
