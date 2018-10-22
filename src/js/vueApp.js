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
const tokenCreatorInstance = TokenCreator.at('0x2c8a58ddba2Dc097EA0f95db6CD51ac7d31D1518');
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
    picked: '-1',
    isActiveSelect: true,
    isActiveInteract: false,
    hrefToInteract: false,
    selectedAddress: '',
    tokenInfo: [],
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
    	/*if (accounts[0] === undefined) {
    		alert('Attention! You need to login in the browser extension \'MetaMask\' and refresh this page!');
    		return;
    	};*/
    	tokenCreatorInstance.amountStandTokens(accounts[0], (err, amountOfTokens) => {
    		if (!err) {
    			for (let i = 0; i < amountOfTokens; i++) {            
  					tokenCreatorInstance.standardTokens(accounts[0], i, (err, addressOfToken) => {
  						if (!err) {           
                let standardTokenInstance = StandardToken.at(addressOfToken);             
                standardTokenInstance.symbol((err, symbolOfToken) => {
                  if (!err) {
                    this.arrOfTokens.push({symbol: symbolOfToken, type: 'Standard', address: addressOfToken});
                  }  
                });  							
  						}
  					});
  				}		
    		}
    	})
      tokenCreatorInstance.amountMintTokens(accounts[0], (err, amountOfTokens) => {
        if (!err) {
          for (let i = 0; i < amountOfTokens; i++) {            
            tokenCreatorInstance.mintableTokens(accounts[0], i, (err, addressOfToken) => {
              if (!err) {           
                let mintableTokenInstance = MintableToken.at(addressOfToken);             
                mintableTokenInstance.symbol((err, symbolOfToken) => {
                  if (!err) {
                    this.arrOfTokens.push({symbol: symbolOfToken, type: 'Mintable', address: addressOfToken});
                  }  
                });               
              }
            });
          }   
        }
      })
  	},
    changeRadio(index) {
      this.picked = index;
      this.isActiveSelect = true;
      this.isActiveInteract = false;
      this.hrefToInteract = false;
      this.selectedAddress = this.arrOfTokens[index].address
    },
    interactWithToken() {
      if (this.picked>=0) {
        this.isActiveSelect = false;
        this.isActiveInteract = true;
        this.hrefToInteract = true;  
        if (this.arrOfTokens[this.picked].type == 'Standard') {  
          this.tokenInfo = [];        
          let standardTokenInstance = StandardToken.at(this.selectedAddress);             
          standardTokenInstance.symbol((err, symbolOfToken) => {
            if (!err) {
              standardTokenInstance.name((err, nameOfToken) => {
                if (!err) {
                  standardTokenInstance.decimals((err, decimalsOfToken) => {
                    if (!err) {
                      standardTokenInstance.totalSupply((err, totalSupplyOfToken) => {
                        if (!err) {
                          standardTokenInstance.transferable((err, transferableOfToken) => {
                            if (!err) {
                              standardTokenInstance.balanceOf(accounts[0], (err, balanceOfOwner) => {
                                if (!err) {
                                  this.tokenInfo.push({ name: nameOfToken,
                                                        symbol: symbolOfToken,
                                                        decimals: decimalsOfToken,
                                                        totalSupply: totalSupplyOfToken / 10 ** decimalsOfToken,
                                                        transferable: transferableOfToken,
                                                        type: 'Standard', 
                                                        balance: balanceOfOwner / 10 ** decimalsOfToken });
                                }  
                              }); 
                            }  
                          });   
                        }  
                      });  
                    }  
                  });  
                }  
              });  
            }  
          });
        }
        if (this.arrOfTokens[this.picked].type == 'Mintable') {    
          this.tokenInfo = [];       
          let mintableTokenInstance = MintableToken.at(this.selectedAddress);             
          mintableTokenInstance.symbol((err, symbolOfToken) => {
            if (!err) {
              mintableTokenInstance.name((err, nameOfToken) => {
                if (!err) {
                  mintableTokenInstance.decimals((err, decimalsOfToken) => {
                    if (!err) {
                      mintableTokenInstance.totalSupply((err, totalSupplyOfToken) => {
                        if (!err) {
                          mintableTokenInstance.transferable((err, transferableOfToken) => {
                            if (!err) {
                              mintableTokenInstance.balanceOf(accounts[0], (err, balanceOfOwner) => {
                                if (!err) {
                                  mintableTokenInstance.mintingFinished((err, mintingFinishedOfToken) => {
                                    if (!err) {
                                      this.tokenInfo.push({ name: nameOfToken,
                                                            symbol: symbolOfToken,
                                                            decimals: decimalsOfToken,
                                                            totalSupply: totalSupplyOfToken / 10 ** decimalsOfToken,
                                                            transferable: transferableOfToken,
                                                            mintingFinished: mintingFinishedOfToken,
                                                            type: 'Mintable', 
                                                            balance: balanceOfOwner / 10 ** decimalsOfToken });
                                    }  
                                  });
                                }  
                              }); 
                            }  
                          });   
                        }  
                      });  
                    }  
                  });  
                }  
              });  
            }  
          });
        }
      } else {
        alert('Choose your token to interact!');
      }
    },
    fromInteractToSelect() {
      this.isActiveSelect = true;
      this.isActiveInteract = false;
      this.hrefToInteract = false;
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