import { Wallet } from "ethers";
import { CONTRACT_NAME } from "../constants";
import { ClaimReward, GasSponsorCreateGiftsParams } from "../types";
import { GiftCore } from "./giftCore";

export class GasSponsor extends GiftCore {
    constructor(){
        super(CONTRACT_NAME.GAS_SPONSOR_CONTRACT_ADDRESS)
    }

    async createGifts(params: GasSponsorCreateGiftsParams): Promise<{contractAddress: string, transactionHash: string}>{
        const { inputConfig, feeToken, giftContractAddress, signer} = params
        
        try {
            const nonce = await this.provider.getTransactionCount(signer.address, 'latest')
            const response = await this.contract.connect(signer).createGift(giftContractAddress, inputConfig, feeToken,{
                gasLimit: 650000,
                nonce: nonce
            });

            const { transactionHash ,events } = await response.wait()

            const transferEvent = events?.find((e: { event: string }) => e.event === "Transfer")
            const contractAddress = transferEvent?.args['to']

            return {
                contractAddress,
                transactionHash
            }
        } catch (error) {
          throw new Error(error as unknown as string)
        }
    }


    async claimReward(params: ClaimReward): Promise<{amount: number, transactionHash: string}>{
        const{ wallet, giftContractAddress } = params
        try {
            const nonce = await this.provider.getTransactionCount(wallet.address, 'latest')
            const owner = new Wallet(wallet.privateKey as string, this.provider)
            const response = await this.contract.connect(owner).claimReward(giftContractAddress,{
                gasLimit: 650000,
                nonce
            })

            const { transactionHash , events } = await response.wait()

            const transferEvent = events?.find((e: { event: string }) => e.event === "Transfer")
            const amount = Number(transferEvent?.args['amount'])

            return {transactionHash, amount}
        } catch (error) {
            throw new Error(error as unknown as string)   
        }
    }
  
}