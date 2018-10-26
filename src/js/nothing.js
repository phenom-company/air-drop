showTokens () {
    	/*if (accounts[0] === undefined) {
    		alert('Attention! You need to login in the browser extension \'MetaMask\' and refresh this page!');
    		return;
    	};
this.arrOfTokens.push({symbol: symbolOfToken, type: 'Standard', address: addressOfToken});
      */
    	tokenCreatorInstance.amountStandTokens(accounts[0], (err, amountOfTokens) => {
    		if (!err) {
    			for (let i = 0; i < amountOfTokens; i++) {            
  					tokenCreatorInstance.standardTokens(accounts[0], i, (err, addressOfToken) => {
  						if (!err) {           
                let standardTokenInstance = StandardToken.at(addressOfToken);             
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
    		}
    	})
},