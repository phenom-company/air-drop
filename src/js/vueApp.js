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

const TokenCreator = web3.eth.contract(abi);
const AirdropContract = web3.eth.contract(abiAirdrop);
const tokenCreatorInstance = TokenCreator.at('0x1b8841a12ac15140321135a4b104970f76db5464');
const accounts = web3.eth.accounts;

let fileTxt = '';

const VueApp = new Vue({
  el: '#app',
  data: {
    tokenNameStand: '',
    tokenSymbolStand: '',
    tokenSupply: '',
    tokenNameMint: '',
    tokenSymbolMint: '',
    addressOfToken: '',
    standardTokens: [],
    mintableTokens: [],
  },
  methods: {
    createStandard () {
    	tokenCreatorInstance.createStandardToken(this.tokenSupply * 10 ** 18, this.tokenNameStand, this.tokenSymbolStand, console.log);  
    	console.log(this.tokenSupply * 10 ** 18);
    },
    createMintable () {
    	tokenCreatorInstance.createMintableToken(this.tokenNameMint, this.tokenSymbolMint, console.log);  
    },
    showTokens () {
    	this.standardTokens = [];
    	this.mintableTokens = [];
    	if (accounts[0] === undefined) {
    		alert('Attention! You need to login in the browser extension \'MetaMask\' and refresh this page!');
    		return;
    	};
    	tokenCreatorInstance.amountStandTokens(accounts[0], (err, result) => {
    		if (!err) {
    			for (let i = 0; i < result; i++) {
  					tokenCreatorInstance.standardTokens(accounts[0], i, (err, result) => {
  						if (!err) {
  							this.standardTokens.push(result);
  						}
  					});
  				}		
    		}
    	})
    	tokenCreatorInstance.amountMintTokens(accounts[0], (err, result) => {
    		if (!err) {
    			for (let i = 0; i < result; i++) {
  					tokenCreatorInstance.mintableTokens(accounts[0], i, (err, result) => {
  						if (!err) {
  							this.mintableTokens.push(result);
  						}
  					});
  				}		
    		}
    	})
  	},
  	handleFileChange(evt) {
		let file = evt.target.files[0];
      	let reader = new FileReader();
      	reader.readAsText(file);
      	reader.onload = function (e) {
	        fileTxt = reader.result;
	    } 
  	},
  	parseText () {
      let fullArr = fileTxt.split(/\;|\n/);
      arrOfAddresses = [];
      arrOfValues = [];
      for (let i = 0; i < fullArr.length - 1; i++) {
      	if (i % 2) {
      		arrOfValues.push(fullArr[i]);
      	} else {
      		arrOfAddresses.push(fullArr[i]);
      	}; 
      };
      console.log(arrOfAddresses);
      console.log(arrOfValues);
      const airdropInstance = AirdropContract.at(this.addressOfToken);
      airdropInstance.airdrop(arrOfAddresses, arrOfValues.map((item)=>{return parseFloat(item + 'E18');}), console.log); // 214 для станд
    },
  },
  beforeMount(){
    this.showTokens()
 },  
})