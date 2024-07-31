export const COIN98_GIFT_FACTORY_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "implement",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_lockTime",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "broadcaster",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "sponsorGasProxy",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "gift",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "rewardToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "totalReward",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalSlots",
              "type": "uint256"
            },
            {
              "internalType": "uint16",
              "name": "randomPercent",
              "type": "uint16"
            },
            {
              "internalType": "uint256",
              "name": "baseMultiplier",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct ICoin98GiftV2.InputConfig",
          "name": "inputConfig",
          "type": "tuple"
        }
      ],
      "name": "CreateGift",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "isActivated",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "percentAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "feeRecipient",
              "type": "address"
            }
          ],
          "indexed": false,
          "internalType": "struct ICoin98GiftFactoryV2.FeeConfig",
          "name": "protocolFee",
          "type": "tuple"
        }
      ],
      "name": "ProtocolFeeChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "name": "SetAdmin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "implement",
          "type": "address"
        }
      ],
      "name": "SetImplement",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes4",
          "name": "_functionSign",
          "type": "bytes4"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_timeUnlock",
          "type": "uint256"
        }
      ],
      "name": "Unlock",
      "type": "event"
    },
    {
      "stateMutability": "nonpayable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PROJECT_NAME",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PROJECT_VERSION",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "broadcaster",
      "outputs": [
        {
          "internalType": "contract IBroadcaster",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "rewardToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "totalReward",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalSlots",
              "type": "uint256"
            },
            {
              "internalType": "uint16",
              "name": "randomPercent",
              "type": "uint16"
            },
            {
              "internalType": "uint256",
              "name": "baseMultiplier",
              "type": "uint256"
            }
          ],
          "internalType": "struct ICoin98GiftV2.InputConfig",
          "name": "inputConfig",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "feeToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "createGift",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getCreatedGift",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "feeToken",
          "type": "address"
        }
      ],
      "name": "getFee",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "isActivated",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "percentAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "feeRecipient",
              "type": "address"
            }
          ],
          "internalType": "struct ICoin98GiftFactoryV2.FeeConfig",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getImplement",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        }
      ],
      "name": "isActiveAdmin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        }
      ],
      "name": "isAdmin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "_functionSign",
          "type": "bytes4"
        }
      ],
      "name": "isUnlock",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "projectKey",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "name": "setAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "feeToken",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "bool",
              "name": "isActivated",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "percentAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "feeRecipient",
              "type": "address"
            }
          ],
          "internalType": "struct ICoin98GiftFactoryV2.FeeConfig",
          "name": "feeConfig",
          "type": "tuple"
        }
      ],
      "name": "setFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "implement",
          "type": "address"
        }
      ],
      "name": "setImplement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sponsorGasProxy",
          "type": "address"
        }
      ],
      "name": "setSponsorGasProxy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "_functionSign",
          "type": "bytes4"
        }
      ],
      "name": "unlock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]