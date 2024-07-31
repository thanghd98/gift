import { CONTRACT_NAME } from "../constants";
import { GasSponsorCreateGiftsParams } from "../types";
import { GiftCore } from "./giftCore";

export class GasSponsor extends GiftCore {
    constructor(){
        super(CONTRACT_NAME.GAS_SPONSOR_CONTRACT_ADDRESS)
    }

    async createGifts(params: GasSponsorCreateGiftsParams){
        const { inputConfig, feeToken, giftContractAddress} = params
        
        try {
            const nonce = await this.signer.getTransactionCount()
            const hash = this.contract.createGift(giftContractAddress, inputConfig, feeToken,{
                gasLimit: 650000,
                nonce: nonce
            });

            return hash
        } catch (error) {
          throw new Error(error as unknown as string)
        }
    }
  
}