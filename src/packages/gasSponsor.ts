import { Wallet } from "ethers";
import { CONTRACT_NAME } from "../constants";
import { ClaimReward, GasSponsorCreateGiftsParams } from "../types";
import { GiftCore } from "./giftCore";

export class GasSponsor extends GiftCore {
    constructor(){
        super(CONTRACT_NAME.GAS_SPONSOR_CONTRACT_ADDRESS)
    }

    async createGifts(params: GasSponsorCreateGiftsParams): Promise<string>{
        const { inputConfig, feeToken, giftContractAddress} = params
        
        try {
            const nonce = await this.provider.getTransactionCount(this.signer.address, 'latest')
            const response = await this.contract.connect(this.signer).createGift(giftContractAddress, inputConfig, feeToken,{
                gasLimit: 650000,
                nonce: nonce
            });

            const { transactionHash } = await response.wait()

            return transactionHash
        } catch (error) {
          throw new Error(error as unknown as string)
        }
    }

    async claimReward(params: ClaimReward): Promise<string>{
        const{ wallet, giftContractAddress } = params
        try {
            const nonce = await this.provider.getTransactionCount(wallet.address, 'latest')
            const owner = new Wallet(wallet.privateKey as string, this.provider)
            const response = await this.contract.connect(owner).claimReward(giftContractAddress,{
                gasLimit: 650000,
                nonce
            })

            const { transactionHash } = await response.wait()

            return transactionHash
        } catch (error) {
            throw new Error(error as unknown as string)   
        }
    }
  
}