import { Contract, ethers, providers, Wallet } from "ethers"
import { CHAIN_ID, CONTRACT_NAME, GIFT_ABI, GIFT_CONTRACT, PRIVATE_KEY, RPC_URL } from "../constants"

export class GiftCore{
    provider: ethers.providers.JsonRpcProvider
    contract: Contract
    signer: ethers.Wallet
    contractAddress: string

    constructor(contractName: CONTRACT_NAME){
        this.contractAddress = GIFT_CONTRACT[contractName]
        this.provider = new providers.JsonRpcProvider(RPC_URL, CHAIN_ID);
        this.signer =new Wallet(PRIVATE_KEY, this.provider)
        this.contract = new Contract(GIFT_CONTRACT[contractName], GIFT_ABI[contractName], this.signer)
    }
}