var StandardToken = artifacts.require("StandardToken");
var config = require('./config.json');

var totalSupply = config.totalSupply;
var nameOfToken = config.nameOfToken;
var symbolOfToken = config.symbolOfToken;

module.exports = function(deployer) {
	deployer.deploy([
		[StandardToken, totalSupply, nameOfToken, symbolOfToken, {overwrite: false}]
		]);
};
