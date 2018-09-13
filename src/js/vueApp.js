function initWeb3() {
	if (typeof web3 !== 'undefined') {
 		web3 = new Web3(web3.currentProvider);
		} else {
 		// set the provider you want from Web3.providers
 		web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 		alert('Attention! To work with this site you need to download the browser extension \'Meta Mask\' and login!');
	}
}
initWeb3();
const abi = [{
	"constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "amountOfTokens",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tokens",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "symbolsOfTokens",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "namesOfTokens",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_creator",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "TokenCreated",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_totalSupply",
          "type": "uint256"
        },
        {
          "name": "_nameOfToken",
          "type": "string"
        },
        {
          "name": "_symbolOfToken",
          "type": "string"
        }
      ],
      "name": "createStandardToken",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_nameOfToken",
          "type": "string"
        },
        {
          "name": "_symbolOfToken",
          "type": "string"
        }
      ],
      "name": "createMintableToken",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
}];
const TokenCreator = web3.eth.contract(abi);
// initiate contract for an address
const tokenCreatorInstance = TokenCreator.at('0xf8f67a8a50fc69655d80ab030eaa9cd866ffff0d');
const accounts = web3.eth.accounts;

const VueApp = new Vue({
  el: '#app',
  data: {
    tokenNameStand: '',
    tokenSymbolStand: '',
    tokenSupply: '',
    tokenAddresses: [],
    tokenNames: [],
    tokenSymbols: [],
    tokenNameMint: '',
    tokenSymbolMint: '',
    preParse: '',
  },
  methods: {
    createStandard () {
    	tokenCreatorInstance.createStandardToken(this.tokenSupply, this.tokenNameStand, this.tokenSymbolStand, console.log);  
    },
    createMintable () {
    	tokenCreatorInstance.createMintableToken(this.tokenNameMint, this.tokenSymbolMint, console.log);  
    },
    showTokens () {
    	this.tokenAddresses = [];
    	this.tokenNames = [];
    	this.tokenSymbols = [];
    	if (accounts[0] === undefined) {
    		alert('Attention! You need to login in the browser extension \'MetaMask\' and refresh this page!');
    		return;
    	};
    	tokenCreatorInstance.amountOfTokens(accounts[0], (err, result) => {
    		if (!err) {
    			let i = result;
    			for (let x = 0; x < i; x++) {
  					tokenCreatorInstance.tokens(accounts[0], x, (err, result) => {
  						if (!err) {
  							this.tokenAddresses.push(result);
  						}
  					});
  				}
  				let j = result;
  				for (let x = 0; x < j; x++) {
  					tokenCreatorInstance.namesOfTokens(accounts[0], x, (err, result) => {
  						if (!err) {
  							this.tokenNames.push(result);
  						}
  					});
  				}
  				let k = result;
  				for (let x = 0; x < k; x++) {
  					tokenCreatorInstance.symbolsOfTokens(accounts[0], x, (err, result) => {
  						if (!err) {
  							this.tokenSymbols.push(result);
  						}
  					});
  				}		
    		}
    	})
  	}
  },
  computed: {
    parseText: function() {
      return this.preParse.split(';');
    }
  }
})
