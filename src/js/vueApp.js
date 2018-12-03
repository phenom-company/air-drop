window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

let fileTxt = '';

Vue.use(window.vuelidate.default);
const alphaNum42 = validators.helpers.regex('alphaNum', /^[0-9a-fx-xA-FX-X]*$/);
const length42 = validators.minLength(42) || validators.maxLength(42);

const VueApp = new Vue({
  el: '#app',
  data: {
    network: '',
    userAddress: '',
    userBalance: '',
    userNonce: '',
    learnMoreOne: false,
    learnMoreTwo: false,
/* Create standard */
    standName: '',
    standSymbol: '',
    standDecimals: '',
    standTotalSupply: '',
    standTransferable: 'Yes',
/* Create mintable */
    mintName: '',
    mintSymbol: '',
    mintDecimals: '',
    mintTransferable: 'Yes',
/* Select token */    
    arrOfTokens: [],
/* Interact with token */
    selectedAddress: '0x6740f858570a0d0b6ee192b3d4791c8233e57868', // Should be ''
    picked: '-1',
    isActiveSelect: false,
    isActiveSelectTab: false,
    isActiveInteract: false,
    isActiveInteractTab: false,
    hrefToInteract: false,
    tokenInfo: [0], // Should be []
    showCanMint: false,
    canMint: false,
    selectedMethod: 'Drop token',
    /* Methods names */
    isActiveDrop: true,
    isActiveBalance: false,
    isActiveTransfer: false,
    isActiveTransferFrom: false,
    isActiveApprove: false,
    isActiveAllowance: false,
    isActiveMakeTransferable: false,
    isActiveFinishMinting: false,
    isActiveMintTokens: false,
    /* Methods content */
    balanceAddress: '',
    balanceOfWallet: '',
    
    recepientAddressTransfer: '',
    amountOfTokensTransfer: '',
    
    ownerAddressTransferFrom: '',
    recepientAddressTransferFrom: '',
    amountOfTokensTransferFrom: '',
    
    spenderAddressApprove: '',
    amountOfTokensApprove: '',
    
    allowanceOfWallet: '',
    ownerAddressAllowance: '',
    spenderAddressAllowance: '',

    makeTransferableBool: '',

    finishMintingBool: '',

    recepientAddressMintTokens: '',
    amountOfTokensMintTokens: '',
  },
  validations: {
    standSymbol: {
      required: validators.required,
    },
    standDecimals: {
      required: validators.required,
      integer: validators.integer,
      between: validators.between(0, 50),
    },
    standTotalSupply: {
      required: validators.required,
      integer: validators.integer,
      minValue: validators.minValue(0),
    },
    mintSymbol: {
      required: validators.required,
    },
    mintDecimals: {
      required: validators.required,
      integer: validators.integer,
      between: validators.between(0, 50),
    },
    balanceAddress: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    recepientAddressTransfer: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    amountOfTokensTransfer: {
      required: validators.required,
      minValue: validators.minValue(0),
    },
    ownerAddressTransferFrom: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    recepientAddressTransferFrom: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    amountOfTokensTransferFrom: {
      required: validators.required,
      minValue: validators.minValue(0),
    },
    spenderAddressApprove: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    amountOfTokensApprove: {
      required: validators.required,
      minValue: validators.minValue(0),
    },
    ownerAddressAllowance: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    spenderAddressAllowance: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    recepientAddressMintTokens: {
      required: validators.required,
      alphaNum42: alphaNum42,
      length42: length42,
    },
    amountOfTokensMintTokens: {
      required: validators.required,
      minValue: validators.minValue(0),
    },
  },
  methods: {
    status(validation) {
      return {
        error: validation.$anyError,
        dirty: !validation.$anyError,
        nothing: !validation.required,
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
    	if (accounts === undefined) {

    	} else {
        this.userAddress = accounts[0].substr(0, 6) + "..." + accounts[0].substr(38);       
        web3.version.getNetwork((err, netId) => {
          switch (netId) {
            case "1":
              this.network = 'Mainnet';
              break
            case "3":
              this.network = 'Ropsten';
              break
            case "4":
              this.network = 'Rinkeby';
              break
            case "42":
              this.network = 'Kovan';
              break
            default:
              alert('This is an unknown network.')
          }
        })
        web3.eth.getBalance(accounts[0], (err, result) => {
          if (!err) {
            this.userBalance = (result.toNumber() / 10 ** 18).toFixed(3);
          }
        });
        web3.eth.getTransactionCount(accounts[0], (err, result) => {
          if (!err) {
            this.userNonce = result;         
          }
        });
        tokenCreatorInstance.amountStandTokens(accounts[0], (err, amountOfTokensStand) => {
          if (!err) {
            tokenCreatorInstance.amountMintTokens(accounts[0], (err, amountOfTokensMint) => {
              if (!err && (amountOfTokensMint + amountOfTokensStand) > 0) {
                this.isActiveSelectTab = true;
                for (let i = 0; i < amountOfTokensStand; i++) {            
                  tokenCreatorInstance.standardTokens(accounts[0], i, (err, addressOfToken) => {
                    if (!err) {           
                      let standardTokenInstance = StandardToken.at(addressOfToken);             
                      standardTokenInstance.symbol((err, symbolOfToken) => {
                        if (!err) {
                          if (symbolOfToken.length >= 15) {
                            symbolOfToken = symbolOfToken.substr(0, 15) + "..."
                          }
                          this.arrOfTokens.push({symbol: symbolOfToken, type: 'Standard', address: addressOfToken});
                        }  
                      });               
                    }
                  });
                }   
                for (let i = 0; i < amountOfTokensMint; i++) {            
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
            });
          } 
        });
      };
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
                                  if (transferableOfToken == true) {
                                    transferableOfToken = 'Yes';
                                  };
                                  if (transferableOfToken == false) {
                                    transferableOfToken = 'No';
                                  };
                                  this.tokenInfo.push({ name: nameOfToken,
                                                        symbol: symbolOfToken,
                                                        decimals: decimalsOfToken * 1,
                                                        totalSupply: totalSupplyOfToken / 10 ** decimalsOfToken,
                                                        transferable: transferableOfToken,
                                                        type: 'Standard', 
                                                        balance: balanceOfOwner / 10 ** decimalsOfToken });
                                  this.showCanMint = false;
                                  this.canMint = false;
                                  this.isActiveSelect = false;
                                  this.isActiveInteractTab = true;
                                  this.isActiveInteract = true;
                                  this.hrefToInteract = true; 
                                  this.tokenInfo.length = 1;
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
                                      if (transferableOfToken == true) {
                                        transferableOfToken = 'Yes';
                                      };
                                      if (transferableOfToken == false) {
                                        transferableOfToken = 'No';
                                      };
                                      if (mintingFinishedOfToken == true) {
                                        mintingFinishedOfToken = 'No';
                                        this.canMint = false;
                                      };
                                      if (mintingFinishedOfToken == false) {
                                        mintingFinishedOfToken = 'Yes';
                                        this.canMint = true;
                                      };
                                      this.tokenInfo.push({ name: nameOfToken,
                                                            symbol: symbolOfToken,
                                                            decimals: decimalsOfToken * 1,
                                                            totalSupply: totalSupplyOfToken / 10 ** decimalsOfToken,
                                                            transferable: transferableOfToken,
                                                            mintingFinished: mintingFinishedOfToken,
                                                            type: 'Mintable', 
                                                            balance: balanceOfOwner / 10 ** decimalsOfToken });
                                      this.showCanMint = true;
                                      this.isActiveSelect = false;
                                      this.isActiveInteractTab = true;
                                      this.isActiveInteract = true;
                                      this.hrefToInteract = true; 
                                      this.tokenInfo.length = 1;
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
      if (this.isActiveSelectTab) {this.isActiveSelect = true;}
      this.isActiveInteract = false;
      this.hrefToInteract = false;
    },
/* Active method */
    inactiveAllMethods() {
      this.isActiveDrop = false;
      this.isActiveBalance = false;
      this.isActiveTransfer = false;
      this.isActiveTransferFrom = false;
      this.isActiveApprove = false;
      this.isActiveAllowance = false;
      this.isActiveMakeTransferable = false;
      this.isActiveFinishMinting = false;
      this.isActiveMintTokens = false;
    },
    selectMethod(a) {
      this.inactiveAllMethods();
      if (a == "Drop token") {this.isActiveDrop = true;};
      if (a == "Balance of") {this.isActiveBalance = true;};
      if (a == "Transfer") {this.isActiveTransfer = true;};
      if (a == "Transfer from") {this.isActiveTransferFrom = true;}; 
      if (a == "Approve") {this.isActiveApprove = true;};
      if (a == "Allowance") {this.isActiveAllowance = true;};
      if (a == "Make transferable") {this.isActiveMakeTransferable = true;};
      if (a == "Finish minting") {this.isActiveFinishMinting = true;};
      if (a == "Mint tokens") {this.isActiveMintTokens = true;};
    },
    handleFileChange(evt) {
    let file = evt.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
          fileTxt = reader.result;
        } 
    },
/* Token methods */
    dropToken() {
      let fullArr = fileTxt.split(/\;|\n/);
      arrOfAddresses = [];
      arrOfValues = [];
      if (fullArr.length > 200) {
        fullArr = fullArr.slice(0, 200);
      };
      for (let i = 0; i < fullArr.length; i++) {
        if (i % 2) {
          arrOfValues.push(fullArr[i]);
        } else {
          arrOfAddresses.push(fullArr[i]);
        }; 
      };
      if (arrOfAddresses.length > 0) {
        const airdropInstance = AirdropContract.at(this.selectedAddress);
        airdropInstance.airdrop(arrOfAddresses, arrOfValues.map((item)=>{return parseFloat(item + 'E' + this.tokenInfo[0].decimals);}), console.log); 
      };
    },
    checkBalance() {
      if (!this.$v.balanceAddress.$invalid) {  
        const tokenInstance = StandardToken.at(this.selectedAddress);
        tokenInstance.balanceOf(this.balanceAddress, (err, result) => {
          if (!err) {
            this.balanceOfWallet = result.toNumber() / 10 ** this.tokenInfo[0].decimals;
          };      
        });
      };
    },
    inactiveBalanceOfWallet() {
      this.balanceOfWallet = '';
    },
    transfer() {
      if (this.$v.recepientAddressTransfer.$invalid || this.$v.amountOfTokensTransfer.$invalid) {
        return;
      } else {  
        const tokenInstance = StandardToken.at(this.selectedAddress);
        tokenInstance.transfer(this.recepientAddressTransfer, this.amountOfTokensTransfer * 10 ** this.tokenInfo[0].decimals, console.log);
      };
    },
    transferFrom() {
      if (this.$v.ownerAddressTransferFrom.$invalid || this.$v.recepientAddressTransferFrom.$invalid || this.$v.amountOfTokensTransferFrom.$invalid) {
        return;
      } else {  
        const tokenInstance = StandardToken.at(this.selectedAddress);
        tokenInstance.transferFrom(this.ownerAddressTransferFrom, this.recepientAddressTransferFrom, this.amountOfTokensTransferFrom * 10 ** this.tokenInfo[0].decimals, console.log);
      };
    },
    approve() {
      if (this.$v.spenderAddressApprove.$invalid || this.$v.amountOfTokensApprove.$invalid) {
        return;
      } else {  
        const tokenInstance = StandardToken.at(this.selectedAddress);
        tokenInstance.approve(this.spenderAddressApprove, this.amountOfTokensApprove * 10 ** this.tokenInfo[0].decimals, console.log);
      };
    },
    checkAllowance() {
      if (this.$v.ownerAddressAllowance.$invalid || this.$v.spenderAddressAllowance.$invalid) { 
        return;
      } else { 
        const tokenInstance = StandardToken.at(this.selectedAddress);
        tokenInstance.allowance(this.ownerAddressAllowance, this.spenderAddressAllowance, (err, result) => {
          if (!err) {
            this.allowanceOfWallet = result.toNumber() / 10 ** this.tokenInfo[0].decimals;
          };      
        });
      };
    },
    inactiveAllowanceOfWallet() {
      this.allowanceOfWallet = '';
    },
    makeTransferable() {
      if (this.makeTransferableBool) { 
        const tokenInstance = StandardToken.at(this.selectedAddress);
        tokenInstance.unfreeze(console.log);
      };
    },
    finishMinting() {
      if (this.finishMintingBool) { 
        const tokenInstance = MintableToken.at(this.selectedAddress);
        tokenInstance.finishMinting(console.log);
      };
    },
    mintTokens() {
      if (this.$v.recepientAddressMintTokens.$invalid || this.$v.amountOfTokensMintTokens.$invalid) {
        return;
      } else {  
        const tokenInstance = MintableToken.at(this.selectedAddress);
        tokenInstance.mintTokens(this.recepientAddressMintTokens, this.amountOfTokensMintTokens * 10 ** this.tokenInfo[0].decimals, console.log);
      };
    },
  },
  beforeMount(){
    if (typeof(web3) != 'undefined') {
      window.TokenCreator = web3.eth.contract(abiTokenCreator);
      window.AirdropContract = web3.eth.contract(abiAirdrop);
      window.StandardToken = web3.eth.contract(abiStandardToken);
      window.MintableToken = web3.eth.contract(abiMintableToken);
      window.tokenCreatorInstance = TokenCreator.at('0x2c8a58ddba2Dc097EA0f95db6CD51ac7d31D1518');
      web3.eth.getAccounts((err, result) => {
        if (!err) {
          window.accounts = result;
          this.showTokens()
        };
      })
    }
    
 },  
})