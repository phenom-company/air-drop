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

const TokenCreator = web3.eth.contract(abiTokenCreator);
const AirdropContract = web3.eth.contract(abiAirdrop);
const StandardToken = web3.eth.contract(abiStandardToken);
const MintableToken = web3.eth.contract(abiMintableToken);
const tokenCreatorInstance = TokenCreator.at('0xe73d991667779550add5459af2e3acf83d00db02');
const accounts = web3.eth.accounts;

let fileTxt = '';

Vue.use(window.vuelidate.default);

const VueApp = new Vue({
  el: '#app',
  data: {
    standName: '',
    standSymbol: '',
    standDecimals: '',
    standTotalSupply: '',
    standTransferable: 'Yes',

    mintName: '',
    mintSymbol: '',
    mintDecimals: '',
    mintTransferable: 'Yes',
    arrOfTokens: [],

    addressAirdropToken: '',
  },
  validations: {
    standSymbol: {
      required: validators.required
    },
    standDecimals: {
      required: validators.required,
      integer: validators.integer,
      between: validators.between(0, 50)
    },
    standTotalSupply: {
      required: validators.required,
      integer: validators.integer,
      minValue: validators.minValue(0)
    },
    mintSymbol: {
      required: validators.required
    },
    mintDecimals: {
      required: validators.required,
      integer: validators.integer,
      between: validators.between(0, 50)
    },
  },
  methods: {
    status(validation) {
      return {
        error: validation.$error,
        dirty: validation.$dirty,
      }
    },
    createStandard () {
      if (this.$v.standSymbol.$invalid || this.$v.standDecimals.$invalid || this.$v.standTotalSupply.$invalid) {
        return;
      } else {     
      	tokenCreatorInstance.createStandardToken(this.standName,
                                                 this.standSymbol,
                                                 this.standDecimals, 
                                                 this.standTotalSupply * 10 ** this.standDecimals,
                                                 this.standTransferable, 
                                                 console.log
        );
      }
    },
    createMintable () {
      if (this.$v.mintSymbol.$invalid || this.$v.mintDecimals.$invalid) {
        return;
      } else { 	
        tokenCreatorInstance.createMintableToken(this.mintName,
                                                 this.mintSymbol,
                                                 this.mintDecimals,
                                                 this.mintTransferable, 
                                                 console.log
        );
      }  
    },
    showTokens () {
    	if (accounts[0] === undefined) {
    		/*alert('Attention! You need to login in the browser extension \'MetaMask\' and refresh this page!');*/
    		return;
    	};
    	tokenCreatorInstance.amountStandTokens(accounts[0], (err, result) => {
    		if (!err) {
    			for (let i = 0; i < result; i++) {
            let tokenSymbol = '';
  					tokenCreatorInstance.standardTokens(accounts[0], i, (err, result) => {
  						if (!err) {              
                let standardTokenInstance = StandardToken.at(result); 
                console.log(standardTokenInstance);              
                standardTokenInstance.symbolOfToken((err, result) => {
                  if (!err) {
                    let tokenSymbol = result;
                    console.log(result);
                    console.log(tokenSymbol);
                  }  
                });
  							this.arrOfTokens.push({symbol: tokenSymbol, type: 'Standard', address: result});
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
  							this.arrOfTokens.push({type: 'Mintable', address: result});
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
      const airdropInstance = AirdropContract.at(this.addressAirdropToken);
      airdropInstance.airdrop(arrOfAddresses, arrOfValues.map((item)=>{return parseFloat(item + 'E18');}), console.log); // 100 max 
    },
  },
  beforeMount(){
    this.showTokens()
 },  
})