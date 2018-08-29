let VueApp = new Vue({
	el: '#app',
	data: {
		wallets: [
			// {
			// 	requiredConfirmations: 0,
			// 	signers: [],
			// 	ethBalance: 0,
			// 	address: "",
			// 	tokens: [
			// 		{
			// 			tokenAddress: "",
			// 			tokenName: "",
			// 			tokenAmount: 0
			// 		}
			// 	]
			// }
		],
		transactions: [],
		currentTx: {},
		addAddress: "",
		addSelect: "wallet address",
		etherTransfersBox: true,
		tokenTransfersBox: false,
		pendingTransfersBox: false,
		doneTransfersBox: true,
		tailSize: 1,
		txId: 0,
		createdTxId: undefined,
		txToAddress: '',
		isEther: 'ether',
		txTokenAddress: '',
		txAmount: 0,
		selectedWalletIndex: 0,
		tokenAddress: '',
		tokenInfo: {},
		userAddress: web3.eth.accounts[0],
		multiSigCreatorAddress: '0x759840f7ab6129d1570DC74E92460C8D00361135',
		choise: 'createActive'
	},
	methods: {
		join: function(array) {
			return (typeof array === 'undefined' ? '' : array.join(', '));
		},
		makeActive: function(val) {
			this.choise = val;
		},
		isActiveTab: function(val) {
			return this.choise === val;
		},
		setCurrentWalletAddress: function() {
			if (typeof App.instances.MultiSigWallet != 'undefined' &&
				typeof this.wallets[this.selectedWalletIndex] != 'undefined') {
				App.instances.MultiSigWallet.address = this.wallets[this.selectedWalletIndex].address;
			}
		},
		addWallet: async function(){
			if (this.addSelect === 'wallet address') {
				let wallet = await App.getExistingWallet(
					this.addAddress,
					this.addSelect
				);
				this.wallets.push(wallet);
			} else {
				let walletArray = await App.getExistingWallet(
					this.addAddress,
					this.addSelect
				);
				for (wallet of walletArray) this.wallets.push(wallet);
			}
		}
		,
		getWalletProperty: function (index, property) {
			if (typeof this.wallets[index] != 'undefined') 
				return this.wallets[index][property];
		},
		refreshWalletInfo: async function(index) {
			// ТУТ КОСЯК ПОПРАВЬ БЛЯДЬ pop
			let wallet = await App.getWalletInfo(this.wallets[index].address);
			// directly changing element at index won't update DOM
			this.wallets.splice(index, 1);
			this.wallets.splice(index, 0, wallet);
		},
		getSelectedWalletProp: function(property) {
			if (typeof this.wallets[this.selectedWalletIndex] != 'undefined') {
				return this.wallets[this.selectedWalletIndex][property];
			}
		},
		getTokenInfo: async function() {
			let info = await App.getTokenInfo(
				this.tokenAddress,
				this.wallets[this.selectedWalletIndex].address
			);
			this.tokenInfo = info;
		},
		// helper function to make txObject out of tx array
		makeTxObject: async function(rawTx) {
			let obj = {
				to: rawTx[0],
				token: rawTx[1],
				amount: rawTx[2],
				confirmations: rawTx[3].toNumber(),
				done: rawTx[4]
			}
			if (obj.token != '0x0000000000000000000000000000000000000000') {
				let decimals = await new Promise((resolve, reject) => {
		  			web3.eth.call({
		  				to: obj.token,
		  				data: web3.sha3('decimals()').slice(0, 10)
		  			}, (err, result) => {
		  				if (err) reject(err);
		  				else resolve(result);
		  			})
  				});
				obj.amount = obj.amount.div(decimals);
			}
			else obj.amount = web3.fromWei(obj.amount, 'ether');
			return obj;
		},
		getTransactions: async function() {
			this.transactions = [];
			let ids = await App.getTxIdList(
				this.etherTransfersBox,
				this.tokenTransfersBox,
				this.pendingTransfersBox,
				this.doneTransfersBox,
				Number(this.tailSize)
			);
			let transactions = await App.getTransactions(ids);
			for (tx of transactions) {
				this.transactions.push(await this.makeTxObject(tx));
			}
			for (let i = 0; i < ids.length; i++) {
				this.transactions[i].id = ids[i];
			}
		},
		getTransactionById: async function() {
			let rawTx = await App.getTransactions([+this.txId]);
			// since getTransactions returns a list
			rawTx = rawTx[0];
			this.currentTx = await this.makeTxObject(rawTx);
			this.currentTx.id = +this.txId;
		},
		signTransaction: function() {
			let txId = this.currentTx.id;
			App.signTransaction(txId);
		},
		unsignTransaction: function() {
			let txId = this.currentTx.id;
			App.unsignTransaction(txId);
		},
		createTransaction: async function() {
			let txId = await App.createTransaction(
				this.txToAddress,
				this.isEther ? '0x0000000000000000000000000000000000000000' : this.txTokenAddress,
				+this.txAmount
			);
			this.createdTxId = txId;
		}
	}
})
