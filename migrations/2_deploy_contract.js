const StandardToken = artifacts.require("StandardToken");
const MintableToken = artifacts.require("MintableToken");
const TokenCreator = artifacts.require("TokenCreator");
const config = require('./config.json');

const totalSupply = config.totalSupply;
const nameOfToken = config.nameOfToken;
const symbolOfToken = config.symbolOfToken;

module.exports = function(deployer) {
	deployer.deploy([
		[StandardToken, totalSupply, nameOfToken, symbolOfToken, {overwrite: false}],
		[MintableToken, nameOfToken, symbolOfToken, {overwrite: false}],
		TokenCreator
		]);
};
