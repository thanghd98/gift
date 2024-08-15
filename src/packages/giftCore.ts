import type { Wallet } from "@wallet/core"
import { Contract, ethers, providers, Wallet as EthersWallet } from "ethers"
import { CHAIN_ID, CONTRACT_NAME, GIFT_ABI, GIFT_CONTRACT, RPC_URL } from "../constants"

export class GiftCore{
    protected provider: ethers.providers.JsonRpcProvider
    protected contract: Contract
    protected admin?: ethers.Wallet
    protected contractAddress: string
    protected abi: ethers.ContractInterface

    constructor(contractName: CONTRACT_NAME, privateKey?: string, isDev?: boolean){    
        this.contractAddress = GIFT_CONTRACT(contractName,isDev)
        this.abi = GIFT_ABI[contractName]
        this.provider = new providers.JsonRpcProvider(RPC_URL, CHAIN_ID);
        this.admin = privateKey ? new EthersWallet(privateKey as string, this.provider) : undefined
        this.contract = new Contract(this.contractAddress, this.abi, this.admin)
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

    getContractAddress(): string {
       return this.contractAddress
    }
}