const StandardToken = artifacts.require("StandardToken");
const MintableToken = artifacts.require("MintableToken");
const config = require('../migrations/config.json');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const totalSupply = config.totalSupply;
const nameOfToken = config.nameOfToken;
const symbolOfToken = config.symbolOfToken;


async function assertRevert(promise) {
    try {
        await promise;
        assert.fail('Expected revert not received');
    } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        const invalidOpcodeFound = error.message.search('invalid opcode') >= 0;
        assert(revertFound || invalidOpcodeFound, `Expected "revert" or "invalid opcode", got ${error} instead`);
    }
};

contract('StandardToken', function (accounts) {

	const owner = accounts[0];
	const holder = accounts[1];
	const notHolder = accounts[2];
	const recipient = accounts[3];

    beforeEach(async function () {
        this.standardToken = await StandardToken.new(totalSupply, nameOfToken, symbolOfToken, {from: owner});
    });

    describe('total supply and owner', function () {
    	it('owner was set incorrectly', async function() {		    	
    		const trueOwner = await this.standardToken.owner();       	
	    	assert.equal(owner, trueOwner);
	    });
        it('should have initial total supply 1000000', async function () {
            const totalSupply = await this.standardToken.totalSupply();
            assert.equal(totalSupply, 1000000);
        });

        it('owner should have initial balance 1000000', async function () {
            const ownerBalance = await this.standardToken.balanceOf(owner);
            assert.equal(ownerBalance, 1000000);
        });      
    });

    describe('balanceOf', function () {
        describe('when the requested account has no tokens', function () {
            it('returns zero', async function () {
                const balance = await this.standardToken.balanceOf(notHolder);
                assert.equal(balance, 0);
            });
        });

        describe('when has some tokens', function() {
            it('is not zero', async function() {
                this.standardToken.transfer(holder, 100, {from: owner});
                const balance = await this.standardToken.balanceOf(holder);
                assert.equal(balance, 100);
            });
        });
    });

    describe('transfer', function () {

        beforeEach('transfer tokens to holder', async function() {
            await this.standardToken.transfer(holder, 100, {from: owner});
        });
            
        describe('when the recipient is not the zero address', function () {
            const to = recipient;
            describe('when the sender does not have enough balance', function () {
                const amount = 101;
                it('reverts', async function () {
                    await assertRevert(this.standardToken.transfer(to, amount, {from: holder}));
                });
            });

        describe('when the sender has enough balance', function () {
            const amount = 100;
            it('transfers the requested amount', async function () {
                await this.standardToken.transfer(to, amount, {from: holder});
                const senderBalance = await this.standardToken.balanceOf(holder);
                assert.equal(senderBalance, 0);
                const recipientBalance = await this.standardToken.balanceOf(to);
                assert.equal(recipientBalance, amount);
            });
        });
    });

    describe('when the recipient is the zero address', function () {
        const to = ZERO_ADDRESS;

        it('reverts', async function () {
            await assertRevert(this.standardToken.transfer(to, 100, {from: holder}));
            });
        });
    
    describe('when the recipient is the token address', function () {
        it('reverts', async function () {
            const to = this.standardToken.address;
            await assertRevert(this.standardToken.transfer(to, 100, {from: holder}));
            });
        });

    });

    describe('approve', function () {
        beforeEach('transfer tokens to holder', async function() {
            await this.standardToken.transfer(holder, 100, {from: owner});
        });

        const spender = recipient;

        describe('when the sender has enough balance', function () {
            const amount = 100;

            describe('when there was no approved amount before', function () {
                it('approves the requested amount', async function () {
                    await this.standardToken.approve(spender, amount, {from: holder});
                    const allowance = await this.standardToken.allowance(holder, spender);
                    assert.equal(allowance, amount);
                });
            });

            describe('when the spender had an approved amount', function () {
                it('reverts', async function () {
                    await this.standardToken.approve(spender, 2, {from: holder});
                    await assertRevert(this.standardToken.approve(spender, 2, {from: holder}));
                });
            });
        });

        describe('when the sender does not have enough balance', function () {
            const amount = 101;
                
            describe('when there was no approved amount before', function () {
                it('approves the requested amount', async function () {
                    await this.standardToken.approve(spender, amount, {from: holder});
                    const allowance = await this.standardToken.allowance(holder, spender);
                    assert.equal(allowance, amount);
                });
            });
        });
    });

    describe('transfer from', function () {
        const spender = holder;

        describe('when the recipient is not the zero address', function () {
            const to = recipient;

            describe('when the spender has enough approved balance', function () {
                beforeEach(async function () {
                    await this.standardToken.transfer(holder, 100, {from: owner});
                    await this.standardToken.approve(spender, 100, {from: holder});
                });

                describe('when the holder has enough balance', function () {
                    const amount = 100;

                    it('transfers the requested amount', async function () {
                        await this.standardToken.transferFrom(holder, to, amount, {from: spender});
                        const senderBalance = await this.standardToken.balanceOf(holder);
                        assert.equal(senderBalance, 0);
                        const recipientBalance = await this.standardToken.balanceOf(to);
                        assert.equal(recipientBalance, amount);
                    });

                    it('decreases the spender allowance', async function () {
                        await this.standardToken.transferFrom(holder, to, amount, {from: spender});
                        const allowance = await this.standardToken.allowance(holder, spender);
                        assert(allowance.eq(0));
                    });
                });

                describe('when the holder does not have enough balance', function () {
                    const amount = 101;
                    it('reverts', async function () {
                        await assertRevert(this.standardToken.transferFrom(holder, to, amount, {from: spender}));
                    });
                });
            });

            describe('when the spender does not have enough approved balance', function () {
                beforeEach(async function () {
                    await this.standardToken.approve(spender, 99, {from: holder});
                });

                describe('when the holder has enough balance', function () {
                    const amount = 100;

                    it('reverts', async function () {
                        await assertRevert(this.standardToken.transferFrom(holder, to, amount, {from: spender}));
                    });
                });

                describe('when the holder does not have enough balance', function () {
                    const amount = 101;

                    it('reverts', async function () {
                        await assertRevert(this.standardToken.transferFrom(owner, to, amount, {from: spender}));
                    });
                });
            });
        });

        describe('when the recipient is the zero address', function () {
            const amount = 100;
            const to = ZERO_ADDRESS;

            beforeEach(async function () {
                await this.standardToken.approve(spender, amount, {from: holder});
            });

            it('reverts', async function () {
                await assertRevert(this.standardToken.transferFrom(holder, to, amount, {from: spender}));
            });
        });

        describe('when the recipient is the contract address', function () {
            const amount = 100;
            
            beforeEach(async function () {
                await this.standardToken.approve(spender, amount, {from: holder});
            });

            it('reverts', async function () {
                const to = this.standardToken.address;
                await assertRevert(this.standardToken.transferFrom(holder, to, amount, {from: spender}));
            });
        });
    });
	describe('airdrop', function () {
		const generateBalances = function (accountsLength) {
			const values = [];
			for (var i = 0; i < accountsLength; i++) {
				values.push(Math.floor(Math.random() * 10 + 1));
			}
			return values;
		};
		const addresses = accounts;
		const values = generateBalances(addresses.length);

        describe('owner should be able to airdrop', function() {
            it('yes', async function() {
                await this.standardToken.airdrop(addresses, values, {from: owner});
            	async function aaa() {
	            	const results = [];
					addresses.forEach(function (acc) {
						results.push(this.standardToken.balanceOf(acc));
					});
					return Promise.all(results);
				};

				async function bbb(responces) {
					const counter = 0;
					responces.forEach(function (responce) {
						// For each account check if balance is valid
						assert(responce.toNumber() == values[counter],
						'balance of ' + addresses[counter] + ' is not valid');
						counter++;
					});
            	};
            	for (var i = 0; i < addresses.length; i++) {
					console.log(addresses[i]);
					console.log(values[i]);
				};
        	});
    	});
	});
});

/*contract('MintableToken', function ([owner, holder, notHolder, recipient]) {

    beforeEach(async function () {
        this.mintableToken = await MintableToken.new(nameOfToken, symbolOfToken, {from: owner});
    });

    describe('total supply and owner', function () {
    	it('owner was set incorrectly', async function() {		    	
    		const trueOwner = await this.standardToken.owner();       	
	    	assert.equal(owner, trueOwner);
	    });
        it('should have initial total supply 1000000', async function () {
            const totalSupply = await this.standardToken.totalSupply();
            assert.equal(totalSupply, 1000000);
        });

        it('owner should have initial balance 1000000', async function () {
            const ownerBalance = await this.standardToken.balanceOf(owner);
            assert.equal(ownerBalance, 1000000);
        });      
    });*/

/*var senderBalance = await StandardTokenContract.balanceOf(recipient);
    			console.log(senderBalance);
    			var senderBalance = await StandardTokenContract.balanceOf(holder);
    			console.log(senderBalance);
    			var senderBalance = await StandardTokenContract.balanceOf(Owner);
    			console.log(senderBalance);*/