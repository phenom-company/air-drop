# Airdrop Dapp
___

[Airdrop][airdrop] is an application to send [ERC20][erc20] tokens to Ethereum wallet list (up to 100), developed by [Phenom.Team][phenom].

## Overview

With Phenom Airdrop decentralized application you can easily create ERC20 tokens, interact and send them to dozens of addresses in a couple of clicks. Airdrops are commonly used as a marketing strategy and can increase awareness of your project and attract new supporters. Try it out, this solution makes the process of Airdrop intuitive as it should be.

## Installation
Clone this repository into your local machine.
Run `truffle compile` to compile smart contracts
## Contract functions
#### contract TokenCreator
**Mappings**
```js
mapping(address => address[]) public mintableTokens;
mapping(address => address[]) public standardTokens;
mapping(address => uint256) public amountMintTokens;
mapping(address => uint256) public amountStandTokens;
```
**createStandardToken**
```js
function createStandardToken(string _name, string _symbol, uint8 _decimals, uint _totalSupply, bool _transferable) public returns (address) {
    address token = new StandardToken(_name, _symbol, _decimals, _totalSupply, _transferable);
    standardTokens[msg.sender].push(token);
    amountStandTokens[msg.sender]++;
    emit TokenCreated(msg.sender, token);
    return token;
}
```
**createMintableToken**
```js
function createMintableToken(string _name, string _symbol, uint8 _decimals, bool _transferable) public returns (address) {
    address token = new MintableToken(_name, _symbol, _decimals, _transferable);
    mintableTokens[msg.sender].push(token);
    amountMintTokens[msg.sender]++;
    emit TokenCreated(msg.sender, token);
    return token;
}
```
**Events**
```js
event TokenCreated(address indexed _creator, address indexed _token);
```
#### contract StandardToken
**constructor**
```js
constructor(string _name, string _symbol, uint8 _decimals, uint _totalSupply, bool _transferable) public {   
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    totalSupply = _totalSupply;
    balances[tx.origin] = _totalSupply;
    transferable = _transferable;
    emit Transfer(address(0), tx.origin, _totalSupply);
}
```
**airdrop**
```js
function airdrop(address[] _addresses, uint256[] _values) public onlyOwner returns (bool) {
    require(_addresses.length == _values.length);
    for (uint256 i = 0; i < _addresses.length; i++) {
        require(transfer(_addresses[i], _values[i]));
    }        
    return true;
}
```
#### contract MintableToken
**constructor**
```js
constructor(string _name, string _symbol, uint8 _decimals, bool _transferable) public {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    transferable = _transferable;
}
```
**mintTokens**
```js
function mintTokens(address _holder, uint _value) public canMint onlyOwner returns (bool) {
    require(_value > 0);
    require(_holder != address(0));
    balances[_holder] = balances[_holder].add(_value);
    totalSupply = totalSupply.add(_value);
    emit Transfer(address(0), _holder, _value);
    return true;
}
```
**airdrop**
```js
function airdrop(address[] _addresses, uint256[] _values) public onlyOwner returns (bool) {
    require(_addresses.length == _values.length);
    for (uint256 i = 0; i < _addresses.length; i++) {
        require(mintTokens(_addresses[i], _values[i]));
    }
    return true;
}
```
**finishMinting**
```js
function finishMinting() public onlyOwner {
    mintingFinished = true;
    emit MintFinished(now);
}
```
**Events**
```js
event MintFinished(uint indexed _timestamp);
```
## Prerequisites
1. node.js at least 7.0.0
2. npm
3. truffle
4. testrpc
## Run tests
* run `testrpc -a 11` in terminal
* run `truffle test` in another terminal
## Collaborators
* **[Alex Smirnov](https://github.com/AlekseiSmirnov)**
* **[Max Petriev](https://github.com/maxpetriev)**
* **[Andrew Khizhnyak](https://github.com/AndrewKhizhnyak)**

[airdrop]: https://airdrop.phenom.team/
[phenom]: https://phenom.team/
[erc20]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
