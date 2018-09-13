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