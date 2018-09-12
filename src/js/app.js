/*App = {
	web3Provider: null,
	contracts: {},
	instances: {},

	init: () => {
		return App.initWeb3();
	},

	initWeb3: () => {
		if (typeof web3 !== 'undefined') {
			App.web3Provider = web3.currentProvider;
		} else {
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
		}
		web3 = new Web3(App.web3Provider);

		//return App.initContract();
	}

	initContract: async () => {
		let data = await $.getJSON('tokenCreatorAbi.json');
		App.contracts.TokenCreator = TruffleContract({
			abi: data.abi,
			contractName: 'TokenCreator'
		});
		App.contracts.TokenCreator.setProvider(App.web3Provider);
		return App.getInstance();
	},

	getInstance: async () => {
		App.instances.TokenCreator = App.contracts.TokenCreator.at('0x33c3296aba8dd97b82c6bf81c91d29e1b8ef59b1');
	}
}

App.init();*/