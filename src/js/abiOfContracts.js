const abi = [{
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "amountStandTokens",
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
      "name": "mintableTokens",
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
        }
      ],
      "name": "amountMintTokens",
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
      "name": "standardTokens",
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

const abiAirdrop = [{
      "constant": false,
      "inputs": [
        {
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "airdrop",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"    
}];