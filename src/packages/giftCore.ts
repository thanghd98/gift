import type { Wallet } from "@wallet/core"
import { Contract, ethers, providers, Wallet as EthersWallet } from "ethers"
import { CHAIN_ID, CONTRACT_NAME, GIFT_ABI, GIFT_CONTRACT, RPC_URL } from "../constants"

export class GiftCore{
    provider: ethers.providers.JsonRpcProvider
    contract: Contract
    admin: ethers.Wallet
    contractAddress: string
    static instance: GiftCore;

    constructor(contractName: CONTRACT_NAME, privateKey?: string){
        this.contractAddress = GIFT_CONTRACT[contractName]
        this.provider = new providers.JsonRpcProvider(RPC_URL, CHAIN_ID);
        this.admin =new EthersWallet(privateKey as string, this.provider)
        this.contract = new Contract(GIFT_CONTRACT[contractName], GIFT_ABI[contractName], this.admin)
    }

    async getNonceAccount(address: string): Promise<number>{
        try {
            const nonce = await this.provider.getTransactionCount(address, 'latest')

            return nonce
        } catch (error) {
            return 0
        }
    }

    createSigner(wallet: Wallet): EthersWallet{
       const signer =  new EthersWallet(wallet.privateKey as string, this.provider)

       return signer
    }
}