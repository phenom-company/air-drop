function initWeb3() {
	if (typeof web3 !== 'undefined') {
 		web3 = new Web3(web3.currentProvider);
		} else {
 		// set the provider you want from Web3.providers
 		web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 		alert('ВНИМАНИЕ! Для работы с сайтом необходимо скачать расширение для браузера \'MetaMask\' и авторизоваться!');
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
const tokenCreatorInstance = TokenCreator.at('0x002726019f72917Acb5874dbDa0A61E189C586cA');
const accounts = web3.eth.accounts;

const VueApp = new Vue({
  el: '#app',
  data: {
    tokenNameStand: '',
    tokenSymbolStand: '',
    tokenSupply: '',
    tokenAddresses: [],
    tokenNameMint: '',
    tokenSymbolMint: '',
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
    	tokenCreatorInstance.amountOfTokens(accounts[0], (err, result) => {
    		if (!err) {
    			let i = result;
    			for (i; i > 0; i--) {
  					tokenCreatorInstance.tokens(accounts[0], i - 1, (err, result) => {
  						if (!err) {
  							this.tokenAddresses.push(result);
  						}
  					});
  				}		
    		}
    	})
  		
  	}
  },
})
