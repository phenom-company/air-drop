App = {
	web3Provider: null,
	contracts: {},
	instances: {},
	// accounts: [],
	// wallets: {},

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

		return App.initContract();
	},

	initContract: async () => {
		let data = await $.getJSON('MultiSigWalletCreator.json');
		App.contracts.MultiSigWalletCreator = TruffleContract({
			abi: data.abi,
			contractName: 'MultiSigWalletCreator'
		});
		App.contracts.MultiSigWalletCreator.setProvider(App.web3Provider);
		return App.getInstance();
	},

	getInstance: async () => {
		App.instances.MultiSigWalletCreator = App.contracts.MultiSigWalletCreator.at('0x759840f7ab6129d1570DC74E92460C8D00361135');
		return App.bindEvents();
	},

	bindEvents: () => {
		// $(document).on('click', '#unlock', App.unlockAccount);
		$(document).on('click', '#create-wallet', App.createWallet);
		// $(document).on('click', '#existing-button', App.getExistingWallet);
	},

	// unlockAccount: () => {
	// 	// What would be if not MetaMask???
	// 	let account = web3.eth.accounts[0];
	// 	App.accounts.push(account);
	// 	// console.log(account);
	// },

	getWalletCreationForms: () => {
		let trim = (s) => { 
            return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
        }
		let forms = {
			confirmations: Number($('#confirms').val()),
			signers: $('#signers').val().split(',').map(trim)
		}
		return forms;
	},

	createWallet: async () => {
		let forms = App.getWalletCreationForms();
		// console.log(forms);
		let txObj = await App.instances.MultiSigWalletCreator.createMultiSigWallet(
			forms.signers,
			forms.confirmations,
			{
				from: VueApp.userAddress
			}
		);
		let address = '0x' + txObj.receipt.logs[0].topics[2].slice(26);
		// console.log(address);
		VueApp.wallets.push({
			requiredConfirmations: forms.confirmations,
			signers: forms.signers,
			ethBalance: 0,
			address: address,
			tokens: []
		})
		return address;
	},

	getWalletsFromSigner: async (signer, data) => {
		App.contracts.MultiSigWallet = TruffleContract({
			abi: data.abi,
			contractName: 'MultiSigWallet'
		});
		App.instances.MultiSigWallet = App.contracts.MultiSigWallet;
		App.instances.MultiSigWallet.setProvider(App.web3Provider);
		let makerInstance = App.instances.MultiSigWalletCreator;
		let length = await makerInstance.numberOfWallets(signer);
		let wallets = [];
		for (let i = 0; i < length.toNumber(); i++) {
			let walletAddress = await makerInstance.wallets(signer, i);
			console.log(walletAddress);
			let wallet = await App.getWalletInfo(walletAddress);
			wallets.push(wallet);
		}
		return wallets;
	},

	getWalletFromWalletAddress: async (address, data) => {
		App.contracts.MultiSigWallet = TruffleContract({
			abi: data.abi,
			contractName: 'MultiSigWallet'
		});
		App.contracts.MultiSigWallet.setProvider(App.web3Provider);
		App.instances.MultiSigWallet = App.contracts.MultiSigWallet;
		let info = await App.getWalletInfo(address);
		return info;
	},

	getExistingWallet: async (address, from) => {
		console.log('Existing address:' + address);
		try {
			var walletData = await $.getJSON('MultiSigWallet.json');
		}
		catch (e) {
			console.log(e);
		}
		let wallets;
		if (from === 'wallet address') {
			wallets = await App.getWalletFromWalletAddress(address, walletData);
		} else {
			wallets = await App.getWalletsFromSigner(address, walletData);

		}
		return wallets;
	},

	getWalletInfo: async (address) => {
		App.instances.MultiSigWallet = App.contracts.MultiSigWallet.at(address);
		let requiredConfirmations = await App.instances.MultiSigWallet.requiredConfirmations();
		requiredConfirmations = requiredConfirmations.toNumber();
		let signers = await App.instances.MultiSigWallet.getSigners();
		let ethBalance = await new Promise((resolve, reject) => {
			web3.eth.getBalance(App.instances.MultiSigWallet.address, (err, result) => {
				if (err) reject(err);
				else resolve(result.toNumber());
			})
		});
		return {
			requiredConfirmations: requiredConfirmations,
			signers: signers,
			ethBalance: web3.fromWei(ethBalance, 'ether'),
			address: App.instances.MultiSigWallet.address,
			tokens: []
		}
	},

	getTokenInfo: async (tokenAddress, walletAddress) => {
		let ERC20Artifact = await $.getJSON('ERC20.json');
		let ERC20Token = TruffleContract({abi: ERC20Artifact.abi});
		ERC20Token.setProvider(App.web3Provider);
		let instance = ERC20Token.at(tokenAddress);
  		let name = await new Promise((resolve, reject) => {
  			web3.eth.call({
  				to: tokenAddress,
  				data: web3.sha3("name()").slice(0, 10)
  			}, (err, result) => {
  				if (err) reject(err);
  				else (resolve(result));
  			});
  		});
  		let decimals = await new Promise((resolve, reject) => {
  			web3.eth.call({
  				to: tokenAddress,
  				data: web3.sha3('decimals()').slice(0, 10)
  			}, (err, result) => {
  				if (err) reject(err);
  				else resolve(result);
  			})
  		})
  		let symbol = await new Promise((resolve, reject) => {
  			web3.eth.call({
  				to: tokenAddress,
  				data: web3.sha3('symbol()').slice(0, 10)
  			}, (err, result) => {
  				if (err) reject(err);
  				else resolve(result);
  			})
  		})
  		let balance = await instance.balanceOf(walletAddress);
		return {
			address: tokenAddress,
			balance: balance.div(10 ** web3.toBigNumber(decimals)).toNumber(),
			name: web3.toAscii(name).replace(/\0/g, '').slice(2),
			symbol: web3.toAscii(symbol).replace(/\0/g, '').slice(2)
		}
	},

	getTxIdList: async (ether, tokens, pending, done, tail) => {
		let instance = App.instances.MultiSigWallet;
		let txIdList = await instance.getTransactionsId(
			pending,
			done,
			tokens,
			ether,
			tail
		);
		return txIdList;
	},

	getTransactions: async (txIdList) => {
		let instance = App.instances.MultiSigWallet;
		let transactions = [];
		for (txId of txIdList) {
			let tx = await instance.transactions(txId);
			transactions.push(tx);
		}
		return transactions;
	},

	signTransaction: (txId) => {
		let instance = App.instances.MultiSigWallet;
		instance.signTransaction(txId, {
			from: VueApp.userAddress
		})
	},

	unsignTransaction: (txId) => {
		let instance = App.instances.MultiSigWallet;
		instance.unsignTransaction(txId, {
			from: VueApp.userAddress
		})
	},

	createTransaction: async (to, tokenAddress, amount) => {
		let instance = App.instances.MultiSigWallet;
		if (tokenAddress === '0x0000000000000000000000000000000000000000') {
			amount = web3.toBigNumber(amount).mul(web3.toBigNumber(10).pow(18));
		}
		else {
			let decimals = await new Promise((resolve, reject) => {
  			web3.eth.call({
  				to: tokenAddress,
  				data: web3.sha3('decimals()').slice(0, 10)
  			}, (err, result) => {
  				if (err) reject(err);
  				else resolve(result);
  			});
  			amount = web3.toBigNumber(amount).mul(web3.toBigNumber(10).pow(decimals));
  		})
		}
		let txOut = await instance.createTransaction(
			to,
			tokenAddress,
			amount,
			{from: VueApp.userAddress}
		);
		// taking 1st event's data to access txId
		let txId = web3.toDecimal(txOut.receipt.logs[0].data);
		return txId;
	}


}

App.init();
